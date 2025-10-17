'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface LandingPageProps {
  onComplete: () => void
}

export default function LandingPage({ onComplete }: LandingPageProps) {
  const [showRocket, setShowRocket] = useState(true)

  useEffect(() => {
    // Show rocket for 3 seconds, then transition
    const timer = setTimeout(() => {
      setShowRocket(false)
      // Give a small delay for any exit animation, then call onComplete
      setTimeout(() => onComplete(), 500)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!showRocket) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50 animate-fadeOut">
        <div className="animate-pulse">
          <h1 className="text-6xl font-bold text-white opacity-50">
            1Zero9 Studio
          </h1>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <div className="animate-pulse-slow text-center">
        <div className="flex items-center justify-center gap-6 mb-8">
          <Image
            src="/images/109-logo-circle-white2.png"
            alt="1Zero9 Studio"
            width={200}
            height={200}
            className="animate-pulse"
          />
        </div>
        <h1 className="text-8xl font-bold text-white mb-4 animate-pulse">
          1Zero9 Studio
        </h1>
        <p className="text-xl text-gray-300">Professional Web Solutions</p>
      </div>
      
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        
        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .animate-fadeOut {
          animation: fadeOut 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
