import { useEffect, useRef } from 'react'

interface Pig {
  id: number
  x: number; y: number
  size: number; rotation: number
  opacity: number
  speedX: number; speedY: number
  rotSpeed: number
}

/**
 * 漂浮猪猪背景动画
 * 使用 Google Noto Emoji 风格 SVG 猪猪
 * 低密度、慢速、纯装饰
 */
export function PigEmoji() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pigsRef = useRef<Pig[]>([])
  const animRef = useRef<number>(0)

  useEffect(() => {
    const pigs: Pig[] = []
    for (let i = 0; i < 8; i++) {
      pigs.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 22 + Math.random() * 30,
        rotation: Math.random() * 360,
        opacity: 0.10 + Math.random() * 0.14,
        speedX: (Math.random() - 0.5) * 0.012,
        speedY: -0.015 - Math.random() * 0.035,
        rotSpeed: (Math.random() - 0.5) * 0.2,
      })
    }
    pigsRef.current = pigs

    let lastTime = performance.now()
    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1)
      lastTime = time

      pigsRef.current.forEach((pig) => {
        pig.x += pig.speedX * dt * 100
        pig.y += pig.speedY * dt * 100
        if (pig.y < -15) { pig.y = 115; pig.x = Math.random() * 100 }
        if (pig.x < -15) pig.x = 115
        if (pig.x > 115) pig.x = -15
        pig.rotation += pig.rotSpeed * dt * 100
        pig.opacity = 0.08 + Math.sin(time * 0.001 + pig.id) * 0.06

        const el = document.getElementById(`google-pig-${pig.id}`)
        if (el) {
          el.style.left = `${pig.x}%`
          el.style.top = `${pig.y}%`
          el.style.transform = `rotate(${pig.rotation}deg)`
          el.style.opacity = `${Math.max(0.06, pig.opacity)}`
        }
      })

      animRef.current = requestAnimationFrame(animate)
    }

    setTimeout(() => { animRef.current = requestAnimationFrame(animate) }, 500)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  // Google 猪猪 SVG (内联 data URI)
  const pigSVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'%3E%3Ccircle cx='64' cy='68' r='52' fill='%23F8BBD0'/%3E%3Cellipse cx='50' cy='55' rx='30' ry='22' fill='%23FCE4EC' opacity='0.6'/%3E%3Cellipse cx='30' cy='28' rx='18' ry='22' fill='%23F48FB1' transform='rotate(-15 30 28)'/%3E%3Cellipse cx='30' cy='28' rx='12' ry='16' fill='%23F8BBD0' transform='rotate(-15 30 28)'/%3E%3Cellipse cx='98' cy='28' rx='18' ry='22' fill='%23F48FB1' transform='rotate(15 98 28)'/%3E%3Cellipse cx='98' cy='28' rx='12' ry='16' fill='%23F8BBD0' transform='rotate(15 98 28)'/%3E%3Cellipse cx='44' cy='55' rx='6' ry='7' fill='%234A2800'/%3E%3Ccircle cx='46' cy='53' r='2.5' fill='white'/%3E%3Cellipse cx='84' cy='55' rx='6' ry='7' fill='%234A2800'/%3E%3Ccircle cx='86' cy='53' r='2.5' fill='white'/%3E%3Cellipse cx='64' cy='78' rx='22' ry='16' fill='%23EC407A'/%3E%3Cellipse cx='56' cy='77' rx='5' ry='6' fill='%238B234E'/%3E%3Cellipse cx='72' cy='77' rx='5' ry='6' fill='%238B234E'/%3E%3Cellipse cx='54' cy='75' rx='1.5' ry='2' fill='%23A8325C'/%3E%3Cellipse cx='70' cy='75' rx='1.5' ry='2' fill='%23A8325C'/%3E%3Cpath d='M 50 92 Q 64 104 78 92' stroke='%23C2185B' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {pigsRef.current.length > 0 ? pigsRef.current.map((pig) => (
        <img
          key={pig.id}
          id={`google-pig-${pig.id}`}
          src={pigSVG}
          alt=""
          className="absolute select-none"
          style={{
            left: `${pig.x}%`,
            top: `${pig.y}%`,
            width: `${pig.size}px`,
            height: `${pig.size}px`,
            opacity: pig.opacity,
            filter: 'blur(0.3px)',
            transition: 'none',
          }}
        />
      )) : (
        // 初始静态渲染（在 useEffect 之前）
        Array.from({ length: 8 }).map((_, i) => (
          <img
            key={i}
            id={`google-pig-${i}`}
            src={pigSVG}
            alt=""
            className="absolute select-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '28px',
              height: '28px',
              opacity: 0.12,
              filter: 'blur(0.3px)',
            }}
          />
        ))
      )}
    </div>
  )
}
