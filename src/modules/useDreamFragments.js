import { useEffect, useMemo, useRef, useState } from "react"
import { supabase } from "../supabaseClient"
import dreamsLocal from "../data/dreamsLocal.json"

const MAX_FALLBACK = 32
const DEFAULT_LIMIT = 40
const EMIT_THRESHOLD = 0.05

function safeArray(input) {
  return Array.isArray(input) ? input : []
}

function splitIntoFragments(text) {
  if (!text) return []
  const cleaned = text.replace(/\s+/g, " ").trim()
  if (!cleaned) return []
  const sentences = cleaned
    .split(/(?<=[.!?…])[ \t]+/u)
    .map((sentence) => sentence.trim())
    .filter(Boolean)

  if (sentences.length <= 1) return [cleaned]
  return sentences
}

function normaliseDreams(dreams = []) {
  return dreams
    .filter((dream) => dream?.visible !== false)
    .flatMap((dream) => {
      const fragments = splitIntoFragments(dream?.contenu)
      return fragments.map((text, index) => ({
        id: `${dream.id || dream.titre || "local"}-${index}`,
        text,
        source: "dream",
        tone: "dream",
        title: dream?.titre,
        guardian: dream?.guardian_name || dream?.guardian_id || null,
        color: dream?.color || null,
        vitality: Number(dream?.vitality ?? 0.5),
        tags: safeArray(dream?.tags),
      }))
    })
}

function normaliseEchoes(echoes = []) {
  return echoes
    .filter((echo) => echo?.content)
    .map((echo) => ({
      id: `${echo.dream_id || "echo"}-${echo.id}`,
      text: echo.content.trim(),
      source: "echo",
      tone: "echo",
      guardian: null,
      color: null,
      vitality: 0.4,
      tags: [],
    }))
}

function normaliseArchive(entries = []) {
  return entries
    .filter((entry) => entry?.wisdom_message || entry?.wisdom_text)
    .map((entry) => ({
      id: `archive-${entry.id}`,
      text: (entry.wisdom_message || entry.wisdom_text || "").trim(),
      source: "archive",
      tone: "wisdom",
      guardian: entry?.guardian_name || null,
      color: entry?.color || null,
      vitality: 0.7 + 0.1 * (entry?.ricochet_level ?? 1),
      tags: [],
    }))
}

function weightFragments(fragments) {
  const base = fragments.map((fragment) => {
    const vitality = Math.max(0.1, fragment.vitality ?? 0.5)
    const lengthFactor = fragment.text.length > 140 ? 0.8 : 1
    const weight = vitality * lengthFactor
    return { fragment, weight }
  })

  const totalWeight = base.reduce((sum, item) => sum + item.weight, 0) || 1
  return base
    .map((item) => ({ ...item, weight: item.weight / totalWeight }))
    .sort((a, b) => b.weight - a.weight)
    .map((item) => item.fragment)
}

function buildFallbackFragments(limit = DEFAULT_LIMIT) {
  return weightFragments(normaliseDreams(dreamsLocal)).slice(0, limit)
}

export function useDreamFragments(options = {}) {
  const { limit = DEFAULT_LIMIT, guardianName, userId } = options
  const [fragments, setFragments] = useState(() =>
    buildFallbackFragments(Math.min(limit, MAX_FALLBACK))
  )
  const [loading, setLoading] = useState(true)
  const bootstrapDone = useRef(false)

  useEffect(() => {
    let cancelled = false

    async function fetchFragments() {
      if (bootstrapDone.current && !navigator.onLine) return
      try {
        setLoading(true)
        const fragmentsCollected = []

        if (typeof supabase?.from !== "function") {
          throw new Error("Supabase client indisponible")
        }

        const dreamsQuery = supabase
          .from("dreams")
          .select(
            "id, titre, contenu, color, guardian_id, guardian_name, tags, vitality, visible, expired_at, user_id"
          )
          .order("born_at", { ascending: false })
          .limit(limit)

        const echoesQuery = supabase
          .from("dream_echoes")
          .select("id, content, dream_id, created_at, user_id")
          .order("created_at", { ascending: false })
          .limit(Math.ceil(limit / 2))

        const archiveQuery = supabase
          .from("dream_archive")
          .select(
            "id, wisdom_message, wisdom_text, guardian_name, color, ricochet_level"
          )
          .order("archived_at", { ascending: false })
          .limit(Math.ceil(limit / 3))

        const [{ data: dreamsData, error: dreamsError }, { data: echoesData, error: echoesError }, { data: archiveData, error: archiveError }] =
          await Promise.all([dreamsQuery, echoesQuery, archiveQuery])

        if (dreamsError) throw dreamsError
        if (echoesError) throw echoesError
        if (archiveError) throw archiveError

        const filteredDreams = normaliseDreams(dreamsData).filter((item) => {
          const matchesGuardian =
            !guardianName ||
            (item.guardian &&
              String(item.guardian).toLowerCase() === guardianName.toLowerCase())
          const matchesUser = !userId || item.user_id === userId
          const isExpired = dreamsData?.find((dream) => `${dream.id}` === item.id?.split("-")[0])
            ?.expired_at
          return matchesGuardian && matchesUser && !isExpired
        })

        fragmentsCollected.push(...filteredDreams)
        fragmentsCollected.push(...normaliseEchoes(echoesData))
        fragmentsCollected.push(...normaliseArchive(archiveData))

        const weighted = weightFragments(fragmentsCollected).slice(0, limit)
        if (!cancelled && weighted.length) {
          setFragments(weighted)
          bootstrapDone.current = true
        }
      } catch (error) {
        console.warn("[useDreamFragments] Fallback sur données locales :", error)
        if (!cancelled) {
          setFragments(buildFallbackFragments(limit))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchFragments()

    if (typeof supabase?.channel !== "function") return

    const channel = supabase
      .channel("public:dream_fragments")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "dreams" },
        fetchFragments
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "dreams" },
        fetchFragments
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "dream_echoes" },
        fetchFragments
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "dream_archive" },
        fetchFragments
      )
      .subscribe()

    return () => {
      cancelled = true
      if (typeof supabase?.removeChannel === "function" && channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [guardianName, limit, userId])

  const queue = useMemo(() => {
    if (!fragments?.length) return []
    return fragments
      .map((fragment, index) => ({
        ...fragment,
        rotationSeed: (index % 7) - 3,
      }))
      .slice(0, limit)
  }, [fragments, limit])

  const intensity = useMemo(() => {
    const averageVitality =
      queue.reduce((sum, fragment) => sum + (fragment.vitality ?? 0.5), 0) /
      (queue.length || 1)
    if (averageVitality > 0.75) return "high"
    if (averageVitality > 0.5) return "mid"
    return "low"
  }, [queue])

  return { fragments: queue, loading, intensity }
}

export function useThrottledEmitter(callback) {
  const lastValue = useRef(0)
  const lastEmit = useRef(0)

  return (value) => {
    const now = performance.now()
    if (
      Math.abs(value - lastValue.current) >= EMIT_THRESHOLD ||
      now - lastEmit.current > 220
    ) {
      lastEmit.current = now
      lastValue.current = value
      callback?.(value)
    } else {
      lastValue.current = value
    }
  }
}
