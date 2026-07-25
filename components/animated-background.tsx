"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
}

interface GeometricShape {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rotation: number
  rotationSpeed: number
  opacity: number
  shape: "triangle" | "square" | "circle"
  color: string
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const shapesRef = useRef<GeometricShape[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      const particles: Particle[] = []
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000)

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          color: Math.random() > 0.5 ? "#3b82f6" : "#8b5cf6",
        })
      }
      return particles
    }

    const createShapes = () => {
      const shapes: GeometricShape[] = []
      const shapeCount = Math.floor((canvas.width * canvas.height) / 50000)
      const shapeTypes: ("triangle" | "square" | "circle")[] = ["triangle", "square", "circle"]

      for (let i = 0; i < shapeCount; i++) {
        shapes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 20 + 10,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          opacity: Math.random() * 0.1 + 0.05,
          shape: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
          color: Math.random() > 0.5 ? "#3b82f6" : "#8b5cf6",
        })
      }
      return shapes
    }

    const drawParticle = (particle: Particle) => {
      ctx.save()
      ctx.globalAlpha = particle.opacity
      ctx.fillStyle = particle.color
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    const drawShape = (shape: GeometricShape) => {
      ctx.save()
      ctx.globalAlpha = shape.opacity
      ctx.fillStyle = shape.color
      ctx.translate(shape.x, shape.y)
      ctx.rotate(shape.rotation)

      switch (shape.shape) {
        case "triangle":
          ctx.beginPath()
          ctx.moveTo(0, -shape.size / 2)
          ctx.lineTo(-shape.size / 2, shape.size / 2)
          ctx.lineTo(shape.size / 2, shape.size / 2)
          ctx.closePath()
          ctx.fill()
          break
        case "square":
          ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size)
          break
        case "circle":
          ctx.beginPath()
          ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2)
          ctx.fill()
          break
      }
      ctx.restore()
    }

    const drawConnections = () => {
      const particles = particlesRef.current
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.save()
            ctx.globalAlpha = ((100 - distance) / 100) * 0.1
            ctx.strokeStyle = "#3b82f6"
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
            ctx.restore()
          }
        }
      }
    }

    const updateParticles = () => {
      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Keep particles within bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))
      })
    }

    const updateShapes = () => {
      shapesRef.current.forEach((shape) => {
        shape.x += shape.vx
        shape.y += shape.vy
        shape.rotation += shape.rotationSpeed

        if (shape.x < -shape.size || shape.x > canvas.width + shape.size) shape.vx *= -1
        if (shape.y < -shape.size || shape.y > canvas.height + shape.size) shape.vy *= -1

        // Keep shapes within bounds
        shape.x = Math.max(-shape.size, Math.min(canvas.width + shape.size, shape.x))
        shape.y = Math.max(-shape.size, Math.min(canvas.height + shape.size, shape.y))
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.03)")
      gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.02)")
      gradient.addColorStop(1, "rgba(59, 130, 246, 0.03)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw shapes
      updateShapes()
      shapesRef.current.forEach(drawShape)

      // Update and draw particles
      updateParticles()
      particlesRef.current.forEach(drawParticle)

      // Draw connections
      drawConnections()

      animationRef.current = requestAnimationFrame(animate)
    }

    const init = () => {
      resizeCanvas()
      particlesRef.current = createParticles()
      shapesRef.current = createShapes()
      animate()
    }

    init()

    const handleResize = () => {
      resizeCanvas()
      particlesRef.current = createParticles()
      shapesRef.current = createShapes()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />
}
