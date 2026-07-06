'use client'

// The LIVI current — a scroll-reactive fluid rendered in raw WebGL.
// One fullscreen triangle, one fragment shader, zero dependencies.
// Scroll velocity injects energy into the flow; scroll progress steers the
// palette from abyss-dark toward the bright CTA water at page bottom; the
// pointer drags a soft bioluminescent glow through the field.
//
// Performance contract:
// - render resolution capped at DPR 1.5 × 0.62 scale (fluid gradients don't
//   need native res), CSS upscales the canvas
// - rAF paused when the tab is hidden or the canvas leaves the viewport
// - all uniform motion is lerped once per frame; listeners are passive
// - prefers-reduced-motion renders a single static frame, no loop

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform float u_scroll;    // 0..1 page progress
uniform float u_energy;    // 0..1 smoothed scroll velocity
uniform vec2  u_pointer;   // -1..1, aspect-corrected in JS
uniform float u_intensity; // component prop: how loud the current is

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p = rot * p * 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = uv;
  p.x *= u_res.x / u_res.y;

  float t = u_time * (0.022 + u_energy * 0.10);

  // Two-pass domain warp = the fluid
  vec2 drift = vec2(t * 0.32, -t * 0.18 - u_scroll * 0.55);
  vec2 q = vec2(
    fbm(p * 0.85 + drift),
    fbm(p * 0.85 + vec2(5.2, 1.3) - drift * 0.7)
  );
  float warp = 1.15 + u_energy * 0.35;
  vec2 r = vec2(
    fbm(p * 0.85 + warp * q + vec2(1.7, 9.2) + 0.15 * t),
    fbm(p * 0.85 + warp * q + vec2(8.3, 2.8) - 0.13 * t)
  );
  float f = fbm(p * 0.85 + warp * r);

  // Palette — abyss → teal current → soft crest
  vec3 abyss   = vec3(0.016, 0.055, 0.050);
  vec3 current = vec3(0.075, 0.360, 0.300);
  vec3 crest   = vec3(0.18, 0.52, 0.44);

  float currentAmt = smoothstep(0.28, 0.78, f) * (0.72 + 0.18 * u_scroll);
  float crestAmt   = smoothstep(0.62, 0.95, f * (0.75 + q.y * 0.5));

  vec3 col = abyss;
  col = mix(col, current, currentAmt * u_intensity);
  col = mix(col, crest, crestAmt * 0.35 * u_intensity);

  // Pointer glow — a soft light dragged through the water
  vec2 pp = u_pointer;
  pp.x *= u_res.x / u_res.y;
  float d = length(p - pp);
  col += crest * exp(-d * d * 2.8) * 0.06 * u_intensity;

  // Depth: darker at top of page, breathing room behind hero copy
  col *= 0.72 + 0.28 * uv.y * uv.y + u_energy * 0.05;

  // Vignette keeps edges quiet behind text columns
  float vig = smoothstep(1.45, 0.35, length(uv - 0.5));
  col *= 0.55 + 0.45 * vig;

  // Dither kills gradient banding
  col += (hash(gl_FragCoord.xy) - 0.5) / 128.0;

  gl_FragColor = vec4(col, 1.0);
}
`

interface FluidCurrentProps {
  className?: string
  /** 0..1 — how loud the current reads. 1 for marketing, ~0.5 for auth panels. */
  intensity?: number
}

export function FluidCurrent({ className, intensity = 1 }: FluidCurrentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const gl =
      canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false }) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null)

    if (!gl) {
      setFailed(true)
      return
    }

    function compile(type: number, src: string): WebGLShader | null {
      const s = gl!.createShader(type)
      if (!s) return null
      gl!.shaderSource(s, src)
      gl!.compileShader(s)
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error('FluidCurrent shader:', gl!.getShaderInfoLog(s))
        return null
      }
      return s
    }

    const vs = compile(gl.VERTEX_SHADER, VERT)
    const fs = compile(gl.FRAGMENT_SHADER, FRAG)
    const prog = gl.createProgram()
    if (!vs || !fs || !prog) {
      setFailed(true)
      return
    }
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setFailed(true)
      return
    }
    gl.useProgram(prog)

    // One oversized triangle beats a quad: no diagonal seam, one primitive.
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uScroll = gl.getUniformLocation(prog, 'u_scroll')
    const uEnergy = gl.getUniformLocation(prog, 'u_energy')
    const uPointer = gl.getUniformLocation(prog, 'u_pointer')
    const uIntensity = gl.getUniformLocation(prog, 'u_intensity')

    const RES_SCALE = 0.62
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = Math.max(1, Math.round(canvas!.clientWidth * dpr * RES_SCALE))
      const h = Math.max(1, Math.round(canvas!.clientHeight * dpr * RES_SCALE))
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w
        canvas!.height = h
        gl!.viewport(0, 0, w, h)
      }
    }

    // ── Motion state, lerped every frame ──
    let scroll = 0
    let scrollTarget = 0
    let energy = 0
    let energyTarget = 0
    let px = 0.5
    let py = 0.45
    let pxTarget = 0.5
    let pyTarget = 0.45
    let lastScrollY = window.scrollY
    let lastScrollT = performance.now()

    function onScroll() {
      const now = performance.now()
      const dy = window.scrollY - lastScrollY
      const dt = Math.max(now - lastScrollT, 1)
      lastScrollY = window.scrollY
      lastScrollT = now
      const vel = Math.abs(dy / dt) // px per ms
      energyTarget = Math.min(vel / 5.0, 1)
      const doc = document.documentElement
      const max = Math.max(doc.scrollHeight - window.innerHeight, 1)
      scrollTarget = Math.min(window.scrollY / max, 1)
    }

    function onPointer(e: PointerEvent) {
      pxTarget = e.clientX / window.innerWidth
      pyTarget = 1 - e.clientY / window.innerHeight
    }

    let raf = 0
    let running = false
    let inView = true
    const t0 = performance.now()

    function draw(now: number) {
      resize()
      const t = (now - t0) / 1000
      scroll += (scrollTarget - scroll) * 0.04
      energy += (energyTarget - energy) * (energyTarget > energy ? 0.08 : 0.02)
      energyTarget *= 0.90 // decay so the water settles after scrolling stops
      px += (pxTarget - px) * 0.03
      py += (pyTarget - py) * 0.03

      gl!.uniform2f(uRes, canvas!.width, canvas!.height)
      gl!.uniform1f(uTime, t)
      gl!.uniform1f(uScroll, scroll)
      gl!.uniform1f(uEnergy, energy)
      gl!.uniform2f(uPointer, px, py)
      gl!.uniform1f(uIntensity, intensity)
      gl!.drawArrays(gl!.TRIANGLES, 0, 3)
    }

    function frame(now: number) {
      if (!running) return
      draw(now)
      raf = requestAnimationFrame(frame)
    }

    function start() {
      if (running || reduced) return
      if (document.hidden || !inView) return
      running = true
      raf = requestAnimationFrame(frame)
    }

    function stop() {
      running = false
      cancelAnimationFrame(raf)
    }

    function onVisibility() {
      document.hidden ? stop() : start()
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        inView ? start() : stop()
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    function onContextLost(e: Event) {
      e.preventDefault()
      stop()
      setFailed(true)
    }

    resize()
    if (reduced) {
      // Single considered frame: mid-page palette, still water.
      scroll = scrollTarget = 0.35
      draw(t0 + 1)
    } else {
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('pointermove', onPointer, { passive: true })
      document.addEventListener('visibilitychange', onVisibility)
      start()
    }
    window.addEventListener('resize', resize)
    canvas.addEventListener('webglcontextlost', onContextLost)

    return () => {
      stop()
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [intensity])

  if (failed) {
    // CSS fallback: same water, no motion.
    return (
      <div
        aria-hidden
        className={cn('pointer-events-none', className)}
        style={{
          background:
            'radial-gradient(120% 90% at 70% 15%, #0E2C25 0%, #06100E 55%), radial-gradient(80% 60% at 20% 85%, #14453A 0%, transparent 60%)',
          backgroundColor: '#06100E',
        }}
      />
    )
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn('pointer-events-none h-full w-full scale-105 blur-[6px]', className)}
    />
  )
}
