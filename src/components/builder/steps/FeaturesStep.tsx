'use client'

import React, { useState, useEffect } from 'react'
import { SiteType, SectionConfig, SectionType, SECTION_METADATA, DEFAULT_SECTIONS } from '@/types/builder'

interface FeaturesStepProps {
  siteType: SiteType | null
  selectedSections: SectionConfig[]
  onUpdateSections: (sections: SectionConfig[]) => void
}

export default function FeaturesStep({
  siteType,
  selectedSections,
  onUpdateSections
}: FeaturesStepProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  // Initialize with default sections for the site type
  useEffect(() => {
    if (siteType && selectedSections.length === 0 && !hasInitialized) {
      const defaultSectionTypes = DEFAULT_SECTIONS[siteType]
      const initialSections: SectionConfig[] = defaultSectionTypes.map((type, index) => ({
        id: `section-${type}-${Date.now()}-${index}`,
        type,
        enabled: true,
        order: index,
      }))
      onUpdateSections(initialSections)
      setHasInitialized(true)
    }
  }, [siteType, selectedSections.length, onUpdateSections, hasInitialized])

  const handleToggleSection = (sectionId: string) => {
    const updated = selectedSections.map(section =>
      section.id === sectionId
        ? { ...section, enabled: !section.enabled }
        : section
    )
    onUpdateSections(updated)
  }

  const handleAddSection = (type: SectionType) => {
    const newSection: SectionConfig = {
      id: `section-${type}-${Date.now()}`,
      type,
      enabled: true,
      order: selectedSections.length,
    }
    onUpdateSections([...selectedSections, newSection])
  }

  const handleRemoveSection = (sectionId: string) => {
    const updated = selectedSections
      .filter(section => section.id !== sectionId)
      .map((section, index) => ({ ...section, order: index }))
    onUpdateSections(updated)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const updated = [...selectedSections]
    const draggedItem = updated[draggedIndex]
    updated.splice(draggedIndex, 1)
    updated.splice(index, 0, draggedItem)

    // Update order property
    const reordered = updated.map((section, idx) => ({ ...section, order: idx }))
    onUpdateSections(reordered)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const availableSections = Object.keys(SECTION_METADATA) as SectionType[]
  const enabledCount = selectedSections.filter(s => s.enabled).length

  // Get sections that aren't already added
  const sectionsNotAdded = availableSections.filter(
    type => !selectedSections.some(section => section.type === type)
  )

  if (!siteType) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="bg-dark-card border-2 border-dark-lighter rounded-xl p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-text-light mb-2">Site Type Required</h3>
          <p className="text-text-gray">Please go back and select a site type first.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12 space-y-4 animate-fadeIn">
        <h2 className="text-4xl md:text-5xl font-black">
          <span className="text-text-light">BUILD YOUR </span>
          <span className="text-rocket-red">SECTIONS</span>
        </h2>
        <p className="text-lg md:text-xl text-text-gray max-w-2xl mx-auto">
          Choose and organize the sections for your {siteType} website
        </p>
        <div className="inline-flex items-center gap-2 bg-dark-card px-4 py-2 rounded-full border border-dark-lighter">
          <span className="text-rocket-red font-bold">{enabledCount}</span>
          <span className="text-text-gray text-sm">sections enabled</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Section List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-text-light">Your Sections</h3>
            <p className="text-sm text-text-gray">Drag to reorder</p>
          </div>

          {selectedSections.length === 0 ? (
            <div className="bg-dark-card border-2 border-dashed border-dark-lighter rounded-xl p-12 text-center">
              <div className="text-5xl mb-4 opacity-50">📋</div>
              <p className="text-text-gray">Loading default sections...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedSections.map((section, index) => {
                const metadata = SECTION_METADATA[section.type]
                return (
                  <div
                    key={section.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`bg-dark-card border-2 rounded-xl p-4 transition-all duration-200 cursor-move ${
                      section.enabled
                        ? 'border-dark-lighter hover:border-rocket-red/50'
                        : 'border-dark-lighter/30 opacity-60'
                    } ${draggedIndex === index ? 'opacity-50 scale-95' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Drag Handle */}
                      <div className="text-text-gray/50 hover:text-text-gray cursor-grab active:cursor-grabbing">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                        </svg>
                      </div>

                      {/* Order Number */}
                      <div className="w-8 h-8 rounded-full bg-rocket-red/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-rocket-red">{index + 1}</span>
                      </div>

                      {/* Section Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{metadata.icon}</span>
                          <h4 className={`font-bold ${section.enabled ? 'text-text-light' : 'text-text-gray'}`}>
                            {metadata.name}
                          </h4>
                        </div>
                        <p className="text-sm text-text-gray">{metadata.description}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {/* Toggle Button */}
                        <button
                          onClick={() => handleToggleSection(section.id)}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                            section.enabled
                              ? 'bg-rocket-red/10 text-rocket-red hover:bg-rocket-red/20'
                              : 'bg-dark-lighter text-text-gray hover:bg-dark-lighter/70'
                          }`}
                        >
                          {section.enabled ? 'Enabled' : 'Disabled'}
                        </button>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveSection(section.id)}
                          className="w-9 h-9 rounded-lg bg-dark-lighter text-text-gray hover:bg-red-500/20 hover:text-red-400 transition-all"
                          title="Remove section"
                        >
                          <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Add Section Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <h3 className="text-xl font-bold text-text-light mb-4">Add More Sections</h3>

            {sectionsNotAdded.length === 0 ? (
              <div className="bg-dark-card border border-dark-lighter rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">✨</div>
                <p className="text-sm text-text-gray">All sections added!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sectionsNotAdded.map((type) => {
                  const metadata = SECTION_METADATA[type]
                  return (
                    <button
                      key={type}
                      onClick={() => handleAddSection(type)}
                      className="w-full text-left bg-dark-card border-2 border-dark-lighter hover:border-rocket-red/50 rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{metadata.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-bold text-text-light group-hover:text-rocket-red transition-colors">
                            {metadata.name}
                          </h4>
                          <p className="text-xs text-text-gray">{metadata.description}</p>
                        </div>
                        <div className="text-rocket-red opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-rocket-red/10 to-accent/10 border border-rocket-red/30 rounded-xl p-4 mt-6">
              <h4 className="font-bold text-text-light mb-2 flex items-center gap-2">
                <span>💡</span> Pro Tips
              </h4>
              <ul className="text-sm text-text-gray space-y-1">
                <li>• Drag sections to reorder</li>
                <li>• Disable sections to hide them</li>
                <li>• Hero section recommended first</li>
                <li>• Contact section recommended last</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Warning */}
      {enabledCount === 0 && (
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-yellow-500/10 border-2 border-yellow-500/50 rounded-xl p-6 flex items-start gap-4 animate-fadeIn">
            <div className="text-3xl">⚠️</div>
            <div>
              <h4 className="font-bold text-yellow-400 mb-1">At least one section required</h4>
              <p className="text-sm text-text-gray">Enable at least one section to continue building your website.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
