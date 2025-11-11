import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, useState, useMemo, useEffect } from "react"
import * as THREE from "three"

// 🎧 AUDIO ENGINE GLOBAL
let ctx, buffer, src, gain
let startTime = 0
let offset = 0
let playing = false

async function ensureAudio() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === "suspended") await ctx.resume()
  if (!buffer) {
    const res = await fetch("/sounds/murmuronirique.mp3")
    const arr = await res.arrayBuffer()
    buffer = await ctx.decodeAudioData(arr)
  }
}

async function toggleAudio(volume = 0.6, fade = 1.2) {
  await ensureAudio()
  if (!playing) {
    src = ctx.createBufferSource()
    gain = ctx.createGain()
    src.buffer = buffer
    src.loop = true
    src.connect(gain).connect(ctx.destination)
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + fade)
    src.start(0, offset % buffer.duration)
    startTime = ctx.currentTime
    playing = true
  } else {
    const elapsed = ctx.currentTime - startTime
    offset = (offset + elapsed) % buffer.duration
    gain?.gain?.linearRampToValueAtTime(0, ctx.currentTime + fade)
    setTimeout(() => {
      try { src?.stop() } catch {}
      playing = false
    }, fade * 1000)
  }
  return playing
}

export default function MeteoniriqueBoreale() {
  const [touchPos, setTouchPos] = useState({ x: 0, y: 0 })
  const [bubbles, setBubbles] = useState([])
  const [words, setWords] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [locked, setLocked] = useState(false) // évite double tap

  const tagBank = ["onde","flux","souffle","lien","écho","rêve","lumière","aurore"]

  async function handleTap(e) {
    if (locked) return
    setLocked(true)
    const t = e.touches?.[0] || e
    const rect = e.target.getBoundingClientRect()
    const x = (t.clientX - rect.left) / rect.width
    const y = (t.clientY - rect.top) / rect.height
    setTouchPos({ x: x - 0.5, y: y - 0.5 })

    const newState = !(await toggleAudio())
    setIsPlaying(newState)

    // 🌟 bulles + mots
    const id = Date.now()
    const emoji = ["💫","🌕","🌬️","✨","🌈"][Math.floor(Math.random()*5)]
    setBubbles((p)=>[...p,{id,emoji,x,y}])
    setTimeout(()=>setBubbles(p=>p.filter(b=>b.id!==id)),2500)
    const word=tagBank[Math.floor(Math.random()*tagBank.length)]
    const wid=`${id}-w`
    setWords(p=>[...p,{id:wid,text:word,x,y,color:randomHSL()}])
    setTimeout(()=>setWords(p=>p.filter(w=>w.id!==wid)),3000)
    setTimeout(()=>setLocked(false),400) // évite double lancement
  }

  // 🧊 rendu
  return (
    <div
      onTouchStart={handleTap}
      onPointerDown={handleTap}
      style={{
        width:"100%",
        height:"100%",
        background:"radial-gradient(circle at 50% 40%, #001820, #000)",
        position:"relative",
        overflow:"hidden",
        userSelect:"none"
      }}
    >
      <Canvas camera={{ position:[0,0,5] }}>
        <ambientLight intensity={0.5}/>
        <RessoParticles touchPos={touchPos} isPlaying={isPlaying}/>
      </Canvas>

      {bubbles.map(b=>(
        <span key={b.id} style={{
          position:"absolute",
          left:`${b.x*100}%`,
          top:`${b.y*100}%`,
          transform:"translate(-50%,-50%)",
          fontSize:"1.8rem",
          opacity:0.9,
          animation:"floatUp 2.5s ease-out forwards",
          pointerEvents:"none"
        }}>{b.emoji}</span>
      ))}
      {words.map(w=>(
        <span key={w.id} style={{
          position:"absolute",
          left:`${w.x*100}%`,
          top:`${w.y*100}%`,
          transform:"translate(-50%,-50%)",
          color:w.color,
          fontSize:"1rem",
          fontWeight:"bold",
          textShadow:`0 0 10px ${w.color}`,
          animation:"wordRise 3s ease-out forwards",
          pointerEvents:"none"
        }}>{w.text}</span>
      ))}

      <div style={{
        position:"absolute",
        bottom:"1rem",
        right:"1rem",
        fontSize:"1.5rem",
        color:isPlaying?"#7fffd4":"#555",
        textShadow:"0 0 10px rgba(127,255,212,0.6)"
      }}>
        {isPlaying?"🔊":"🔇"}
      </div>

      <style>{`
        @keyframes floatUp {
          0%{transform:translate(-50%,-50%) scale(0.4);opacity:1;}
          100%{transform:translate(-50%,-150%) scale(1.2);opacity:0;}
        }
        @keyframes wordRise {
          0%{transform:translate(-50%,-50%) scale(0.6);opacity:0;}
          50%{opacity:1;}
          100%{transform:translate(-50%,-120%) scale(1.2);opacity:0;}
        }
      `}</style>
    </div>
  )
}

/* === Réseau boréal + sphère filaire === */
function RessoParticles({ touchPos, isPlaying }) {
  const group=useRef()
  const pointMat=useRef()
  const wireMat=useRef()
  const count=80

  const positions=useMemo(()=>{
    const arr=[]
    for(let i=0;i<count;i++){
      const r=1.2+Math.random()*0.8
      const theta=Math.random()*Math.PI*2
      const phi=Math.acos(2*Math.random()-1)
      arr.push({
        base:new THREE.Vector3(
          r*Math.sin(phi)*Math.cos(theta),
          r*Math.sin(phi)*Math.sin(theta),
          r*Math.cos(phi)
        ),
        amp:0.06+Math.random()*0.1,
        freq:0.4+Math.random()*0.9,
        phase:Math.random()*Math.PI*2
      })
    }
    return arr
  },[])

  useFrame(({clock})=>{
    const t=clock.getElapsedTime()
    const lvl=isPlaying?0.6+0.3*Math.sin(t*2)**2:0.1
    const arr=[]
    positions.forEach((p,i)=>{
      const off=p.amp*Math.sin(t*p.freq+p.phase+i*0.25)
      arr.push(
        p.base.x+off*(1+lvl),
        p.base.y+off*(1+lvl),
        p.base.z+off*(1+lvl)
      )
    })
    const geo=group.current.children[0].geometry
    geo.attributes.position.array.set(new Float32Array(arr))
    geo.attributes.position.needsUpdate=true

    group.current.rotation.y+=0.001+touchPos.x*0.02
    group.current.rotation.x+=0.0008+touchPos.y*0.015
    const hue=(t*30+lvl*200)%360
    pointMat.current.color.set(`hsl(${hue},90%,${65+lvl*10}%)`)
    wireMat.current.color.set(`hsl(${(hue+200)%360},90%,70%)`)
    wireMat.current.opacity=0.5
  })

  return(
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length}
            array={new Float32Array(positions.flatMap(p=>[p.base.x,p.base.y,p.base.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial ref={pointMat} size={0.06} transparent opacity={0.8} blending={THREE.AdditiveBlending}/>
      </points>
      <mesh>
        <sphereGeometry args={[1,24,24]}/>
        <meshBasicMaterial ref={wireMat} wireframe transparent blending={THREE.AdditiveBlending}/>
      </mesh>
    </group>
  )
}

function randomHSL(){
  const h=Math.floor(Math.random()*360)
  const s=60+Math.random()*25
  const l=60+Math.random()*20
  return`hsl(${h},${s}%,${l}%)`
}