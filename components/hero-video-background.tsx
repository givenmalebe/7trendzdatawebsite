"use client"

import { useEffect, useRef, useState } from "react"

const HERO_VIDEO_SRC = "/videos/hero-ai-cybersecurity.mp4"

export function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoFailed, setVideoFailed] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video || videoFailed) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) {
      video.pause()
      return
    }

    video.play().catch(() => setVideoFailed(true))
  }, [videoFailed])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {!videoFailed ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={() => setVideoFailed(true)}
          className="absolute inset-0 h-full w-full object-cover scale-105"
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-slate-950"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(187 92% 53% / 0.15), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, hsl(0 72% 51% / 0.1), transparent), linear-gradient(to bottom, rgb(2 6 23), rgb(15 23 42))",
          }}
        />
      )}

      <div className="absolute inset-0 bg-slate-950/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/20 via-transparent to-red-950/15" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, transparent 0%, rgba(2, 6, 23, 0.35) 100%)",
        }}
      />
    </div>
  )
}
