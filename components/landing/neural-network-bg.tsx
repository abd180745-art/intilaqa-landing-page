'use client'

import { useEffect, useRef } from 'react'

type Node = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

export function NeuralNetworkBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let nodes: Node[] = []
    let raf = 0

    const ACCENT = '230, 150, 5' // #e69605
    const LINK_DIST = 150
    const MOUSE_DIST = 180

    function resize() {
      if (!canvas) return
      width = canvas.clientWidth
      height = canvas.clientHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // density scales with area, capped for performance
      const count = Math.min(140, Math.floor((width * height) / 11000))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.8,
      }))
    }

    function step() {
      ctx.clearRect(0, 0, width, height)

      for (const n of nodes) {
        // drift
        n.x += n.vx
        n.y += n.vy

        // wrap around edges softly
        if (n.x < -20) n.x = width + 20
        if (n.x > width + 20) n.x = -20
        if (n.y < -20) n.y = height + 20
        if (n.y > height + 20) n.y = -20

        // mouse repulsion
        const dxm = n.x - mouse.current.x
        const dym = n.y - mouse.current.y
        const dm = Math.hypot(dxm, dym)
        if (dm < MOUSE_DIST && dm > 0.01) {
          const force = (MOUSE_DIST - dm) / MOUSE_DIST
          n.x += (dxm / dm) * force * 1.4
          n.y += (dym / dm) * force * 1.4
        }
      }

      // links
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d = Math.hypot(dx, dy)
          if (d < LINK_DIST) {
            const mid_x = (a.x + b.x) / 2
            const mid_y = (a.y + b.y) / 2
            const distToMouse = Math.hypot(
              mid_x - mouse.current.x,
              mid_y - mouse.current.y,
            )
            const base = (1 - d / LINK_DIST) * 0.35
            const glow =
              distToMouse < MOUSE_DIST
                ? (1 - distToMouse / MOUSE_DIST) * 0.65
                : 0
            const alpha = Math.min(0.9, base + glow)
            ctx.strokeStyle = `rgba(${ACCENT}, ${alpha})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // nodes
      for (const n of nodes) {
        const distToMouse = Math.hypot(
          n.x - mouse.current.x,
          n.y - mouse.current.y,
        )
        const near = distToMouse < MOUSE_DIST
        const intensity = near ? 1 - distToMouse / MOUSE_DIST : 0
        const radius = n.r + intensity * 1.6

        // glow halo
        ctx.beginPath()
        ctx.arc(n.x, n.y, radius * 3.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${ACCENT}, ${0.15 + intensity * 0.2})`
        ctx.fill()

        // core
        ctx.beginPath()
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${ACCENT}, ${0.8 + intensity * 0.2})`
        ctx.fill()
      }

      raf = requestAnimationFrame(step)
    }

    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect()
      mouse.current.x = e.clientX - rect.left
      mouse.current.y = e.clientY - rect.top
    }
    function onLeave() {
      mouse.current.x = -9999
      mouse.current.y = -9999
    }

    resize()
    step()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  )
}
