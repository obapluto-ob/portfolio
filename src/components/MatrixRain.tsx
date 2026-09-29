import { useEffect, useRef } from 'react'

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[]|/\\;:!@#$%^&*'

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const fontSize = 13
    let cols = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(cols).fill(1)

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 13, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      cols = Math.floor(canvas.width / fontSize)
      while (drops.length < cols) drops.push(Math.random() * -100)

      for (let i = 0; i < cols; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        const y = drops[i] * fontSize

        // Bright head character
        ctx.fillStyle = '#ffffff'
        ctx.font = `bold ${fontSize}px 'JetBrains Mono', monospace`
        ctx.fillText(char, i * fontSize, y)

        // Trail
        ctx.fillStyle = '#00ff41'
        ctx.font = `${fontSize}px 'JetBrains Mono', monospace`
        ctx.fillText(char, i * fontSize, y - fontSize)

        // Dim trail
        ctx.fillStyle = 'rgba(0,255,65,0.3)'
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * fontSize, y - fontSize * 2)

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 45)
    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.18 }}
      aria-hidden="true"
    />
  )
}

export default MatrixRain
