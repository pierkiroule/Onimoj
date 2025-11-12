const subs = new Map()

export function onGuideEvent(name, cb) {
  if (!subs.has(name)) subs.set(name, new Set())
  subs.get(name).add(cb)
  return () => subs.get(name)?.delete(cb)
}

export function emitGuideEvent(name, payload) {
  subs.get(name)?.forEach((cb) => {
    try {
      cb(payload)
    } catch (err) {
      console.error("FilBleuGuide subscriber error:", err)
    }
  })
}
