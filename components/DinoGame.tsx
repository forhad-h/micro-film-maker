"use client"

import { useEffect, useRef, useState } from "react"

// Simple offline runner game (original implementation, not Chrome's code)
// Press Space or Up Arrow to jump. Avoid incoming obstacles.
export default function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return
    const ctx = canvasEl.getContext("2d")!
    // Non-null assertion for subsequent usage inside inner functions
    const c = canvasEl

    const groundY = 120
    let lastTime = 0
    let speed = 250
    const gravity = 900
    const jumpVelocity = -400

    const player = {
      x: 30,
      y: groundY,
      vy: 0,
      width: 28,
      height: 32,
      jumping: false,
    }
    const obstacles: { x: number; width: number; passed?: boolean }[] = []
    let spawnTimer = 0

    function reset() {
      player.y = groundY
      player.vy = 0
      player.jumping = false
      obstacles.length = 0
      setScore(0)
      speed = 250
      spawnTimer = 0
      setGameOver(false)
      lastTime = performance.now()
    }

    function spawnObstacle() {
      const width = 20 + Math.random() * 25
      obstacles.push({ x: c.width + width, width })
    }

    function update(dt: number) {
      if (!started || gameOver) return
      // Increase difficulty gradually
      speed += dt * 2
      spawnTimer -= dt
      if (spawnTimer <= 0) {
        spawnObstacle()
        spawnTimer = 0.9 + Math.random() * 0.6
      }

      // Physics
      player.vy += gravity * dt
      player.y += player.vy * dt
      if (player.y >= groundY) {
        player.y = groundY
        player.vy = 0
        player.jumping = false
      }

      // Obstacles movement
      for (const obs of obstacles) {
        obs.x -= speed * dt
        // Scoring when passed
        if (!obs.passed && obs.x + obs.width < player.x) {
          obs.passed = true
          setScore((s) => s + 1)
        }
        // Collision
        if (
          obs.x < player.x + player.width - 8 &&
          obs.x + obs.width > player.x + 8 &&
          player.y + player.height > groundY - 10
        ) {
          setGameOver(true)
        }
      }

      // Remove off-screen obstacles
      while (obstacles.length && obstacles[0].x + obstacles[0].width < 0) {
        obstacles.shift()
      }
    }

    function draw() {
      ctx.fillStyle = "#0a0a0a"
      ctx.fillRect(0, 0, c.width, c.height)

      // Ground line
      ctx.strokeStyle = "#333"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, groundY + player.height / 2)
      ctx.lineTo(c.width, groundY + player.height / 2)
      ctx.stroke()

      // Player
      ctx.fillStyle = gameOver ? "#7f1d1d" : "#38bdf8"
      ctx.fillRect(
        player.x,
        player.y - player.height,
        player.width,
        player.height
      )

      // Obstacles
      ctx.fillStyle = "#10b981"
      for (const obs of obstacles) {
        ctx.fillRect(obs.x, groundY - 20, obs.width, 20)
      }

      // Score / Messages
      ctx.fillStyle = "#aaa"
      ctx.font = "14px monospace"
      ctx.fillText(`Score: ${score}`, 10, 18)
      if (!started) {
        ctx.fillText("Press Space to Start", 10, 36)
      } else if (gameOver) {
        ctx.fillStyle = "#ef4444"
        ctx.fillText("Game Over - Press R to Retry", 10, 36)
      }
    }

    function frame(ts: number) {
      const dt = Math.min(0.033, (ts - lastTime) / 1000)
      lastTime = ts
      update(dt)
      draw()
      requestAnimationFrame(frame)
    }
    lastTime = performance.now()
    requestAnimationFrame(frame)

    function handleKey(e: KeyboardEvent) {
      if (e.code === "Space" || e.code === "ArrowUp") {
        if (!started) {
          setStarted(true)
          reset()
          return
        }
        if (!gameOver && !player.jumping) {
          player.vy = jumpVelocity
          player.jumping = true
        }
      } else if (e.code === "KeyR") {
        if (gameOver) {
          reset()
        }
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [score, gameOver, started])

  return (
    <div className="mt-4" aria-label="Offline mini game">
      <canvas
        ref={canvasRef}
        width={420}
        height={160}
        className="border border-gray-700 rounded bg-black"
      />
      <p className="text-xs text-gray-500 mt-1">
        Jump with Space / ↑. Retry with R. Play while your film renders.
      </p>
    </div>
  )
}
