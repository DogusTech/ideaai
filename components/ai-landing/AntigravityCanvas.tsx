"use client"

import React, { useRef, useEffect, useCallback } from "react"

// =============================================================================
// SIMPLEX NOISE — Stefan Gustavson's 2D implementation (MIT License)
// =============================================================================
const GRAD3 = [
  [1, 1], [-1, 1], [1, -1], [-1, -1],
  [1, 0], [-1, 0], [0, 1], [0, -1],
]

const PERM = new Uint8Array(512)
const PERM_MOD8 = new Uint8Array(512)

function seedNoise(seed: number) {
  const p = new Uint8Array(256)
  for (let i = 0; i < 256; i++) p[i] = i
  let s = seed
  for (let i = 255; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647
    const j = s % (i + 1)
    ;[p[i], p[j]] = [p[j], p[i]]
  }
  for (let i = 0; i < 512; i++) {
    PERM[i] = p[i & 255]
    PERM_MOD8[i] = PERM[i] % 8
  }
}

seedNoise(42)

const F2 = 0.5 * (Math.sqrt(3) - 1)
const G2 = (3 - Math.sqrt(3)) / 6

function simplex2D(xin: number, yin: number): number {
  const s = (xin + yin) * F2
  const i = Math.floor(xin + s)
  const j = Math.floor(yin + s)
  const t = (i + j) * G2
  const X0 = i - t
  const Y0 = j - t
  const x0 = xin - X0
  const y0 = yin - Y0

  let i1: number, j1: number
  if (x0 > y0) { i1 = 1; j1 = 0 } else { i1 = 0; j1 = 1 }

  const x1 = x0 - i1 + G2
  const y1 = y0 - j1 + G2
  const x2 = x0 - 1 + 2 * G2
  const y2 = y0 - 1 + 2 * G2

  const ii = i & 255
  const jj = j & 255

  let n0 = 0, n1 = 0, n2 = 0

  let t0 = 0.5 - x0 * x0 - y0 * y0
  if (t0 >= 0) {
    t0 *= t0
    const gi = PERM_MOD8[ii + PERM[jj]]
    n0 = t0 * t0 * (GRAD3[gi][0] * x0 + GRAD3[gi][1] * y0)
  }

  let t1 = 0.5 - x1 * x1 - y1 * y1
  if (t1 >= 0) {
    t1 *= t1
    const gi = PERM_MOD8[ii + i1 + PERM[jj + j1]]
    n1 = t1 * t1 * (GRAD3[gi][0] * x1 + GRAD3[gi][1] * y1)
  }

  let t2 = 0.5 - x2 * x2 - y2 * y2
  if (t2 >= 0) {
    t2 *= t2
    const gi = PERM_MOD8[ii + 1 + PERM[jj + 1]]
    n2 = t2 * t2 * (GRAD3[gi][0] * x2 + GRAD3[gi][1] * y2)
  }

  return 70 * (n0 + n1 + n2)
}

function simplex3D(x: number, y: number, z: number): number {
  return simplex2D(x + z, y + z)
}

// =============================================================================
// COLOR MIXING UTILS
// =============================================================================
function hexToRgb(hex: string) {
  const bigint = parseInt(hex.replace("#", ""), 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  }
}

function mixColor(c1: {r: number, g: number, b: number}, c2: {r: number, g: number, b: number}, t: number) {
  t = Math.max(0, Math.min(1, t))
  return {
    r: Math.round(c1.r + (c2.r - c1.r) * t),
    g: Math.round(c1.g + (c2.g - c1.g) * t),
    b: Math.round(c1.b + (c2.b - c1.b) * t)
  }
}

// Exactly matching the shader colors from the light theme in Antigravity
const c1 = hexToRgb("#2c64ed") // Blue
const c2 = hexToRgb("#f84242") // Red
const c3 = hexToRgb("#ffcf03") // Yellow

function getNoiseColor(progress: number) {
  const h = 0.5
  let finalColor
  if (progress < h) {
    finalColor = mixColor(c1, c2, progress / h)
  } else {
    finalColor = mixColor(c2, c3, (progress - h) / (1.0 - h))
  }
  return `rgb(${finalColor.r}, ${finalColor.g}, ${finalColor.b})`
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val))
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0)
  return t * t * (3.0 - 2.0 * t)
}

// =============================================================================
// ANTIGRAVITY PHYSICS ENGINE - 3D MORPHING SPHERE
// =============================================================================

interface Particle {
  refX: number
  refY: number
  refZ: number
  scale: number
  velocity: number
  z: number
}

interface AntigravityCanvasProps {
  className?: string
}

export function AntigravityCanvas({ className = "" }: AntigravityCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  
  // Mouse state
  const mouseRef = useRef({ x: 0, y: 0 })
  const smoothMouseRef = useRef({ x: 0, y: 0 })
  const isHoveringRef = useRef(false)
  
  // Ring state
  const ringPosRef = useRef({ x: 0, y: 0 })
  const cursorPosRef = useRef({ x: 0, y: 0 })
  
  const sizeRef = useRef({ w: 0, h: 0 })
  const startTimeRef = useRef(0)

  const initParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = []
    
    // Fibonacci sphere for even 3D distribution
    const gridSize = 1200 
    
    for (let i = 0; i < gridSize; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / gridSize);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      
      const x = Math.cos(theta) * Math.sin(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(phi);

      // Only add if not at the extreme poles to match Antigravity
      particles.push({
        refX: x,
        refY: y,
        refZ: z,
        scale: Math.random() * 0.5,
        velocity: Math.random(),
        z: 0
      })
    }
    
    particlesRef.current = particles
  }, [])

  const renderFrame = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    const { w, h } = sizeRef.current
    const particles = particlesRef.current
    const elapsed = time - startTimeRef.current

    if (particles.length === 0 || w === 0) return

    ctx.clearRect(0, 0, w, h)

    const uTime = elapsed
    
    // Simulate the noise-based idle cursor movement
    const noiseIdleX = (simplex2D(uTime * 0.66 + 94.234, 0) * 2.0)
    const noiseIdleY = (simplex2D(uTime * 0.75 + 21.028, 0) * 2.0)
    
    const mouse = mouseRef.current
    
    // Cursor target mixes between noise (idle) and actual mouse position
    if (isHoveringRef.current) {
      cursorPosRef.current.x = mouse.x * 0.5 + noiseIdleX * 0.1
      cursorPosRef.current.y = mouse.y * 0.5 + noiseIdleY * 0.1
      
      ringPosRef.current.x += (cursorPosRef.current.x - ringPosRef.current.x) * 0.1
      ringPosRef.current.y += (cursorPosRef.current.y - ringPosRef.current.y) * 0.1
    } else {
      cursorPosRef.current.x = noiseIdleX * 0.4
      cursorPosRef.current.y = noiseIdleY * 0.3
      
      ringPosRef.current.x += (cursorPosRef.current.x - ringPosRef.current.x) * 0.02
      ringPosRef.current.y += (cursorPosRef.current.y - ringPosRef.current.y) * 0.02
    }
    
    const uRingPos = ringPosRef.current

    const scaleFactor = Math.min(w, h) * 0.45
    const cx = w / 2
    const cy = h / 2
    const timeScale = uTime * 0.3

    // 3D Rotations over time (Sphere rotation)
    const rotY = uTime * 0.15;
    const rotX = Math.sin(uTime * 0.1) * 0.15;

    // Array to hold computed frame data for depth sorting
    const renderList = []

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      
      // Rotate around X
      let y1 = p.refY * Math.cos(rotX) - p.refZ * Math.sin(rotX);
      let z1 = p.refY * Math.sin(rotX) + p.refZ * Math.cos(rotX);
      
      // Rotate around Y
      let currentX = p.refX * Math.cos(rotY) + z1 * Math.sin(rotY);
      let currentY = y1;
      let currentZ = -p.refX * Math.sin(rotY) + z1 * Math.cos(rotY);
      
      // Morphing 3D Noise Displacement
      const noiseDisp = simplex3D(currentX * 1.5 + 10, currentY * 1.5, timeScale) * 0.15;
      const morphX = currentX * (1 + noiseDisp);
      const morphY = currentY * (1 + noiseDisp);
      let morphZ = currentZ * (1 + noiseDisp);

      // Magnetic Mouse Interaction (pull/push towards mouse)
      const dx = morphX - uRingPos.x;
      const dy = morphY - uRingPos.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      let pushX = 0;
      let pushY = 0;
      let pushZ = 0;
      
      if (dist < 0.8) {
        const force = smoothstep(0.8, 0.0, dist) * 0.3;
        pushX = dx * force;
        pushY = dy * force;
        pushZ = force * 0.2; // Push outwards in Z when near mouse
      }
      
      const finalX = morphX + pushX;
      const finalY = morphY + pushY;
      const finalZ = morphZ + pushZ;
      
      // Update painter's depth
      p.z = finalZ;
      
      // Project to 2D Screen
      const perspective = 3.5 / (3.5 - finalZ);
      const projX = finalX * perspective;
      const projY = finalY * perspective;
      
      // Calculate color based on 3D spatial position to get the Red/Blue sides
      // Left side is red, right side is blue, top can be yellow
      const colorMix = smoothstep(-1.0, 1.0, currentX * 1.2 + currentY * 0.2);
      const pColor = getNoiseColor(colorMix);
      
      // Size calculation
      const depthScale = smoothstep(-1.5, 1.5, finalZ);
      const sizePower = 0.8 + (noiseDisp * 2.0);
      
      const scaleDiff = sizePower - p.scale;
      p.scale += scaleDiff * 0.1;
      
      const baseSize = Math.max(0.1, p.scale) * depthScale * perspective * 8.0;

      // Dash angle follows the flow field roughly
      const angle = Math.atan2(projY, projX) + (Math.PI / 2) + (noiseDisp * 2.0);

      renderList.push({
        x: projX,
        y: projY,
        z: finalZ,
        size: baseSize,
        angle: angle,
        color: pColor,
        alpha: smoothstep(-1.0, 1.0, finalZ) * 0.9 // Fade out particles in the back
      });
    }

    // Sort for painter's algorithm (back to front)
    renderList.sort((a, b) => a.z - b.z);

    // Draw
    for (let i = 0; i < renderList.length; i++) {
      const p = renderList[i];
      if (p.size < 0.3 || p.alpha < 0.05) continue;
      
      const drawX = cx + (p.x * scaleFactor);
      const drawY = cy + (p.y * scaleFactor);
      
      const dashLength = p.size * 1.5;
      const dashThickness = Math.max(1, p.size * 0.4);
      
      ctx.save();
      ctx.translate(drawX, drawY);
      ctx.rotate(p.angle);
      
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      
      ctx.beginPath();
      ctx.roundRect(
        -dashLength / 2,
        -dashThickness / 2,
        dashLength,
        dashThickness,
        dashThickness / 2 
      );
      ctx.fill();
      ctx.restore();
    }
    
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const w = rect.width
      const h = rect.height

      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const prevW = sizeRef.current.w
      sizeRef.current = { w, h }

      if (prevW === 0 || Math.abs(prevW - w) > 100) {
        initParticles(w, h)
      }
    }

    resize()

    const resizeObserver = new ResizeObserver(resize)
    const parent = canvas.parentElement
    if (parent) resizeObserver.observe(parent)

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      }
      isHoveringRef.current = true
    }

    const handleMouseLeave = () => {
      isHoveringRef.current = false
    }

    const listenTarget = parent || canvas
    listenTarget.addEventListener("mousemove", handleMouseMove as EventListener)
    listenTarget.addEventListener("mouseleave", handleMouseLeave)

    // Animation loop
    startTimeRef.current = performance.now() / 1000

    const loop = (now: number) => {
      const time = now / 1000 - startTimeRef.current + 0.001
      renderFrame(ctx, time)
      animFrameRef.current = requestAnimationFrame(loop)
    }

    animFrameRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      resizeObserver.disconnect()
      listenTarget.removeEventListener("mousemove", handleMouseMove as EventListener)
      listenTarget.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [initParticles, renderFrame])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
