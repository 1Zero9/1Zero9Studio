'use client'

import React from 'react'

interface SubpageHeaderProps {
  title: string
  titleHighlight: string
  description: string
  icon?: string
}

export default function SubpageHeader({ title, titleHighlight, description, icon }: SubpageHeaderProps) {
  return (
    <section className="pt-32 pb-16 px-6 md:px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-dark-bg relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-bg/80 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Optional Icon */}
        {icon && (
          <div className="flex justify-center mb-6">
            <div className="text-6xl md:text-7xl animate-pulse">{icon}</div>
          </div>
        )}

        {/* Title */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-center mb-6 leading-tight">
          <span className="text-text-light">{title} </span>
          <span className="text-rocket-red">{titleHighlight}</span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-text-gray text-center max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  )
}
