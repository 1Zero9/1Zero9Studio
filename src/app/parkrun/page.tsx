'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

// Confetti particle
function Confetti({ color, delay }: { color: string; delay: number }) {
  const randomX = Math.random() * 100
  const randomRotate = Math.random() * 360
  const randomDuration = 2 + Math.random() * 2

  return (
    <motion.div
      className="absolute w-3 h-3"
      style={{
        left: `${randomX}%`,
        top: '-20px',
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? '50%' : '0%',
      }}
      initial={{ y: 0, rotate: 0, opacity: 1 }}
      animate={{
        y: '100vh',
        rotate: randomRotate + 720,
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: randomDuration,
        delay,
        ease: 'easeIn',
      }}
    />
  )
}

// Celebration overlay component
function Celebration({ active }: { active: boolean }) {
  const colors = ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#ff00ff', '#ffa500', '#ff69b4']
  const confettiCount = 50

  if (!active) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Confetti */}
      {Array.from({ length: confettiCount }).map((_, i) => (
        <Confetti
          key={i}
          color={colors[i % colors.length]}
          delay={i * 0.05}
        />
      ))}

      {/* Flash overlay */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.3, 0, 0.2, 0, 0.1, 0],
          backgroundColor: ['#fff', '#ff0', '#fff', '#f00', '#fff'],
        }}
        transition={{ duration: 1.5, times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 1] }}
      />

      {/* Radial burst lines */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={`burst-${i}`}
          className="absolute left-1/2 top-1/2 w-1 origin-bottom"
          style={{
            height: '50vh',
            backgroundColor: colors[i % colors.length],
            transform: `rotate(${i * 30}deg)`,
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: [0, 1, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: 0.8, delay: 0.2 + i * 0.03 }}
        />
      ))}
    </div>
  )
}

// Flashing lights around slot machine
function FlashingLights({ active }: { active: boolean }) {
  if (!active) return null

  return (
    <>
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2
        const x = Math.cos(angle) * 180
        const y = Math.sin(angle) * 120
        return (
          <motion.div
            key={i}
            className="absolute w-4 h-4 rounded-full"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              backgroundColor: i % 2 === 0 ? '#ff0' : '#f00',
              boxShadow: `0 0 20px ${i % 2 === 0 ? '#ff0' : '#f00'}`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              delay: i * 0.05,
            }}
          />
        )
      })}
    </>
  )
}

// Alarm bells
function AlarmBells({ active }: { active: boolean }) {
  if (!active) return null

  return (
    <>
      <motion.div
        className="absolute -top-16 -left-8 text-6xl"
        animate={{ rotate: [-20, 20, -20] }}
        transition={{ duration: 0.15, repeat: Infinity }}
      >
        🔔
      </motion.div>
      <motion.div
        className="absolute -top-16 -right-8 text-6xl"
        animate={{ rotate: [20, -20, 20] }}
        transition={{ duration: 0.15, repeat: Infinity }}
      >
        🔔
      </motion.div>
      <motion.div
        className="absolute -top-12 left-1/2 -translate-x-1/2 text-4xl"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 0.3, repeat: Infinity }}
      >
        🚨
      </motion.div>
    </>
  )
}

// Simple running figure using basic shapes
function RunningFigure({ delay = 0, scale = 1, color = '#00a8a8' }: { delay?: number; scale?: number; color?: string }) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % 2)
    }, 120)
    return () => clearInterval(interval)
  }, [])

  // Frame 0: right leg forward, left arm forward
  // Frame 1: left leg forward, right arm forward

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      style={{ transform: `scale(${scale})` }}
    >
      <svg width="60" height="100" viewBox="0 0 60 100" style={{ overflow: 'visible' }}>
        {/* Head */}
        <rect x="18" y="0" width="24" height="24" fill="#c9a06c" />
        {/* Hair */}
        <rect x="18" y="0" width="24" height="6" fill="#3d2814" />
        {/* Eyes */}
        <rect x="22" y="10" width="4" height="4" fill="#2d5a9b" />
        <rect x="34" y="10" width="4" height="4" fill="#2d5a9b" />

        {/* Body */}
        <rect x="20" y="24" width="20" height="20" fill={color} />

        {/* Left Arm */}
        <motion.rect
          x="10"
          y="24"
          width="8"
          height="22"
          fill={color}
          style={{ transformOrigin: '14px 24px' }}
          animate={{ rotate: frame === 0 ? 35 : -35 }}
          transition={{ duration: 0.12, ease: 'easeInOut' }}
        />

        {/* Right Arm */}
        <motion.rect
          x="42"
          y="24"
          width="8"
          height="22"
          fill={color}
          style={{ transformOrigin: '46px 24px' }}
          animate={{ rotate: frame === 0 ? -35 : 35 }}
          transition={{ duration: 0.12, ease: 'easeInOut' }}
        />

        {/* Left Leg */}
        <motion.rect
          x="20"
          y="44"
          width="9"
          height="28"
          fill="#3b4d81"
          style={{ transformOrigin: '24px 44px' }}
          animate={{ rotate: frame === 0 ? -30 : 30 }}
          transition={{ duration: 0.12, ease: 'easeInOut' }}
        />

        {/* Right Leg */}
        <motion.rect
          x="31"
          y="44"
          width="9"
          height="28"
          fill="#3b4d81"
          style={{ transformOrigin: '36px 44px' }}
          animate={{ rotate: frame === 0 ? 30 : -30 }}
          transition={{ duration: 0.12, ease: 'easeInOut' }}
        />
      </svg>
    </motion.div>
  )
}

// Slot machine component - 3D cylinder effect
function SlotMachine({ onLanded }: { onLanded?: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSpinning, setIsSpinning] = useState(true)
  const [isStopped, setIsStopped] = useState(false)
  const [showDrama, setShowDrama] = useState(false)
  const [rotation, setRotation] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const options = ['YES', 'MAYBE', 'NO', 'NEARLY', 'ALMOST', 'NOPE', 'YES!', 'NAH']

  const getTextColor = (text: string) => {
    if (['NO', 'NOPE', 'NAH'].includes(text)) return '#dc2626'
    if (['YES', 'YES!'].includes(text)) return '#16a34a'
    return '#d97706'
  }

  const getPrevIndex = (i: number) => (i - 1 + options.length) % options.length
  const getNextIndex = (i: number) => (i + 1) % options.length

  useEffect(() => {
    let mounted = true
    let animationFrame: number

    const runSpin = async () => {
      // Fast spin phase with smooth rotation
      let speed = 15
      const spinFast = () => {
        if (!mounted) return
        setRotation(r => r + speed)
        setCurrentIndex(() => {
          const newRotation = (rotation + speed) % 360
          return Math.floor(newRotation / 45) % options.length
        })
        animationFrame = requestAnimationFrame(spinFast)
      }

      intervalRef.current = setInterval(() => {
        setCurrentIndex(i => (i + 1) % options.length)
      }, 80)

      await new Promise(r => setTimeout(r, 2000))
      if (!mounted) return

      if (intervalRef.current) clearInterval(intervalRef.current)

      // Slow down phase
      const slowSpeeds = [120, 180, 260, 360, 480, 620, 800, 1000]

      for (let i = 0; i < slowSpeeds.length; i++) {
        if (!mounted) return
        await new Promise(r => setTimeout(r, slowSpeeds[i]))
        setCurrentIndex(prev => (prev + 1) % options.length)
      }

      // Final landing on NO (index 2)
      await new Promise(r => setTimeout(r, 600))
      if (!mounted) return

      setCurrentIndex(2)
      setIsSpinning(false)
      setIsStopped(true)
      setShowDrama(true)
      onLanded?.()
    }

    runSpin()

    return () => {
      mounted = false
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [options.length])

  const currentText = options[currentIndex]
  const prevText = options[getPrevIndex(currentIndex)]
  const nextText = options[getNextIndex(currentIndex)]

  return (
    <div className="flex flex-col items-center gap-6 relative">
      {/* Celebration effects */}
      <Celebration active={showDrama} />

      {/* Flashing lights around machine */}
      <FlashingLights active={showDrama} />

      {/* Alarm bells */}
      <AlarmBells active={showDrama} />

      <motion.div
        className="relative w-80 h-44 bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl border-4 overflow-hidden"
        animate={isStopped ? {
          scale: [1, 1.15, 1.05, 1.1, 1],
          borderColor: showDrama ? ['#eab308', '#ff0000', '#ffff00', '#ff0000', '#eab308'] : '#eab308',
          boxShadow: showDrama
            ? ['0 0 30px rgba(234,179,8,0.3)', '0 0 60px rgba(255,0,0,0.8)', '0 0 80px rgba(255,255,0,0.8)', '0 0 60px rgba(255,0,0,0.8)', '0 0 40px rgba(234,179,8,0.5)']
            : '0 0 30px rgba(234,179,8,0.3)',
        } : {}}
        transition={{ duration: 1, times: [0, 0.2, 0.4, 0.6, 1] }}
        style={{ perspective: '500px' }}
      >
        {/* Slot window with 3D cylinder */}
        <motion.div
          className="absolute inset-3 rounded-xl overflow-hidden border-2 border-gray-400"
          animate={showDrama ? {
            backgroundColor: ['#e5e5e5', '#ffe0e0', '#fff0e0', '#ffe0e0', '#e5e5e5'],
            borderColor: ['#9ca3af', '#ff0000', '#ffaa00', '#ff0000', '#9ca3af'],
          } : { backgroundColor: '#e5e5e5' }}
          transition={{ duration: 0.5, repeat: showDrama ? Infinity : 0 }}
        >
          {/* Cylinder container */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{
              perspective: '300px',
              perspectiveOrigin: 'center center',
            }}
          >
            {/* The spinning drum */}
            <motion.div
              className="relative w-full"
              style={{
                transformStyle: 'preserve-3d',
              }}
              animate={isSpinning ? { rotateX: [0, -360] } : { rotateX: 0 }}
              transition={isSpinning ? {
                duration: 0.4,
                repeat: Infinity,
                ease: 'linear',
              } : { duration: 0.3 }}
            >
              {/* Previous option (top, rotated away) */}
              <div
                className="absolute w-full text-center"
                style={{
                  transform: 'translateY(-32px) rotateX(40deg)',
                  opacity: 0.4,
                  fontSize: '1.5rem',
                  fontFamily: 'Impact, sans-serif',
                  color: getTextColor(prevText),
                  filter: 'blur(1px)',
                }}
              >
                {prevText}
              </div>

              {/* Current option (center) */}
              <motion.div
                className="w-full text-center"
                style={{
                  fontSize: showDrama ? '3.8rem' : '3.2rem',
                  fontFamily: 'Impact, sans-serif',
                  fontWeight: 900,
                  color: getTextColor(currentText),
                  letterSpacing: '0.05em',
                  textShadow: showDrama
                    ? '0 0 20px #ff0000, 0 0 40px #ff0000, 0 0 60px #ff0000, 2px 2px 0 #000'
                    : '2px 2px 4px rgba(0,0,0,0.2)',
                }}
                animate={showDrama ? {
                  scale: [1, 1.2, 1.1, 1.15, 1.1],
                  textShadow: [
                    '0 0 20px #ff0000, 0 0 40px #ff0000',
                    '0 0 40px #ff0000, 0 0 80px #ffff00',
                    '0 0 30px #ff0000, 0 0 60px #ff0000',
                    '0 0 50px #ffff00, 0 0 100px #ff0000',
                    '0 0 30px #ff0000, 0 0 60px #ff0000',
                  ]
                } : {}}
                transition={{ duration: 1.5, repeat: showDrama ? Infinity : 0 }}
              >
                {currentText}
              </motion.div>

              {/* Next option (bottom, rotated away) */}
              <div
                className="absolute w-full text-center"
                style={{
                  transform: 'translateY(32px) rotateX(-40deg)',
                  opacity: 0.4,
                  fontSize: '1.5rem',
                  fontFamily: 'Impact, sans-serif',
                  color: getTextColor(nextText),
                  filter: 'blur(1px)',
                }}
              >
                {nextText}
              </div>
            </motion.div>
          </div>

          {/* Curved shading overlays for cylinder effect */}
          <div
            className="absolute inset-x-0 top-0 h-10 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
              borderRadius: '12px 12px 0 0',
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-10 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
              borderRadius: '0 0 12px 12px',
            }}
          />

          {/* Highlight stripe in center */}
          <div
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-14 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
            }}
          />

          {/* Side shadows for depth */}
          <div
            className="absolute inset-y-0 left-0 w-6 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, rgba(0,0,0,0.2) 0%, transparent 100%)',
            }}
          />
          <div
            className="absolute inset-y-0 right-0 w-6 pointer-events-none"
            style={{
              background: 'linear-gradient(to left, rgba(0,0,0,0.2) 0%, transparent 100%)',
            }}
          />
        </motion.div>

        {/* Corner lights */}
        <div className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.25s' }} />
        <div className="absolute bottom-1 left-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.75s' }} />

        {/* Side accents */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-16 bg-yellow-400 rounded-r" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-16 bg-yellow-400 rounded-l" />
      </motion.div>

      {isStopped && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl text-gray-500 italic"
        >
          Maybe next time...
        </motion.p>
      )}
    </div>
  )
}

// Minecraft-style tree
function PixelTree({ height = 120, left = '10%', delay = 0 }: { height?: number; left?: string; delay?: number }) {
  const trunkWidth = height * 0.15
  const trunkHeight = height * 0.4
  const leavesSize = height * 0.5

  return (
    <motion.div
      className="absolute bottom-8"
      style={{ left }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      {/* Leaves - blocky layers */}
      <div
        className="absolute"
        style={{
          bottom: trunkHeight - 10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: leavesSize,
          height: leavesSize,
          backgroundColor: '#2d5a27',
        }}
      />
      <div
        className="absolute"
        style={{
          bottom: trunkHeight + leavesSize * 0.3,
          left: '50%',
          transform: 'translateX(-50%)',
          width: leavesSize * 0.75,
          height: leavesSize * 0.6,
          backgroundColor: '#3d7a37',
        }}
      />
      <div
        className="absolute"
        style={{
          bottom: trunkHeight + leavesSize * 0.7,
          left: '50%',
          transform: 'translateX(-50%)',
          width: leavesSize * 0.4,
          height: leavesSize * 0.35,
          backgroundColor: '#4a9a42',
        }}
      />
      {/* Trunk */}
      <div
        style={{
          width: trunkWidth,
          height: trunkHeight,
          backgroundColor: '#6b4423',
          boxShadow: `inset -${trunkWidth * 0.2}px 0 0 #4a2f17`,
        }}
      />
    </motion.div>
  )
}

export default function StevePage() {
  const [shake, setShake] = useState(false)

  const handleLanded = useCallback(() => {
    setShake(true)
    setTimeout(() => setShake(false), 1500)
  }, [])

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-green-300 flex flex-col items-center justify-center py-12 px-6 overflow-hidden relative"
      animate={shake ? {
        x: [0, -10, 10, -10, 10, -5, 5, -5, 5, 0],
        y: [0, 5, -5, 5, -5, 3, -3, 3, -3, 0],
      } : {}}
      transition={{ duration: 0.8 }}
    >

      {/* Forest background */}
      {/* Back row - smaller, darker trees */}
      <PixelTree height={80} left="5%" delay={0.1} />
      <PixelTree height={90} left="15%" delay={0.15} />
      <PixelTree height={75} left="25%" delay={0.2} />
      <PixelTree height={85} left="70%" delay={0.25} />
      <PixelTree height={80} left="80%" delay={0.3} />
      <PixelTree height={95} left="92%" delay={0.35} />

      {/* Front row - larger trees */}
      <PixelTree height={130} left="0%" delay={0} />
      <PixelTree height={150} left="12%" delay={0.05} />
      <PixelTree height={120} left="85%" delay={0.1} />
      <PixelTree height={140} left="95%" delay={0.15} />

      {/* Running figures */}
      <div className="relative mb-6">
        {/* Dust clouds */}
        <div className="absolute -bottom-4 left-0 right-0 flex justify-center gap-12">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-8 h-3 bg-amber-300/40 rounded-full blur-sm"
              animate={{
                scaleX: [1, 1.5, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 0.25, repeat: Infinity, delay: i * 0.08 }}
            />
          ))}
        </div>

        {/* The runners */}
        <div className="flex gap-4 md:gap-8 items-end">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.24, repeat: Infinity, ease: 'easeInOut' }}
          >
            <RunningFigure delay={0} scale={0.8} />
          </motion.div>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.24, repeat: Infinity, ease: 'easeInOut', delay: 0.06 }}
          >
            <RunningFigure delay={0.1} scale={1} />
          </motion.div>
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.24, repeat: Infinity, ease: 'easeInOut', delay: 0.12 }}
          >
            <RunningFigure delay={0.2} scale={0.8} />
          </motion.div>
        </div>
      </div>

      {/* Question text */}
      <motion.h1
        className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-800 text-center mb-12 mt-4 drop-shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Is Steve running tomorrow.....?
      </motion.h1>

      {/* Slot machine */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <SlotMachine onLanded={handleLanded} />
      </motion.div>

      {/* Forest floor */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#4a7a34]" />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#5d8c3d] border-t-4 border-[#7ab551]" />

      {/* Grass tufts */}
      <div className="absolute bottom-8 left-[20%] w-3 h-4 bg-[#7ab551]" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
      <div className="absolute bottom-8 left-[35%] w-2 h-3 bg-[#6a9541]" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
      <div className="absolute bottom-8 left-[50%] w-3 h-5 bg-[#7ab551]" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
      <div className="absolute bottom-8 left-[65%] w-2 h-3 bg-[#6a9541]" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
      <div className="absolute bottom-8 left-[78%] w-3 h-4 bg-[#7ab551]" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
    </motion.div>
  )
}
