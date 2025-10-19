'use client'

import React, { useState } from 'react'
import { UserContent } from '@/types/builder'

interface ContentStepProps {
  userContent: UserContent
  onUpdateContent: (content: Partial<UserContent>) => void
}

export default function ContentStep({ userContent, onUpdateContent }: ContentStepProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(userContent.logo || null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleInputChange = (field: keyof UserContent, value: string) => {
    onUpdateContent({ [field]: value })
  }

  const handleSocialLinkChange = (platform: string, value: string) => {
    onUpdateContent({
      socialLinks: {
        ...userContent.socialLinks,
        [platform]: value,
      },
    })
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a valid image file (JPG, PNG, SVG, or WebP)')
      return
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setUploadError('File size must be less than 5MB')
      return
    }

    setUploadError(null)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setLogoPreview(result)
      onUpdateContent({ logo: result })
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    setLogoPreview(null)
    onUpdateContent({ logo: undefined })
    setUploadError(null)
  }

  const isRequired = (field: keyof UserContent): boolean => {
    return field === 'businessName' || field === 'tagline'
  }

  const requiredFieldsFilled = !!userContent.businessName && !!userContent.tagline

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12 space-y-4 animate-fadeIn">
        <h2 className="text-4xl md:text-5xl font-black">
          <span className="text-text-light">ADD YOUR </span>
          <span className="text-rocket-red">CONTENT</span>
        </h2>
        <p className="text-lg md:text-xl text-text-gray max-w-2xl mx-auto">
          Tell us about your business and provide the content for your website
        </p>
      </div>

      <div className="space-y-8">
        {/* Business Basics */}
        <div className="bg-dark-card border-2 border-dark-lighter rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-text-light flex items-center gap-2">
            <span className="text-2xl">🏢</span>
            Business Basics
          </h3>

          {/* Business Name */}
          <div>
            <label className="block text-text-light font-semibold mb-2">
              Business Name <span className="text-rocket-red">*</span>
            </label>
            <input
              type="text"
              value={userContent.businessName || ''}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              placeholder="e.g., Acme Studios"
              className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-lighter rounded-lg text-text-light placeholder:text-text-gray/50 focus:outline-none focus:border-rocket-red transition-colors"
              required
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-text-light font-semibold mb-2">
              Tagline / Slogan <span className="text-rocket-red">*</span>
            </label>
            <input
              type="text"
              value={userContent.tagline || ''}
              onChange={(e) => handleInputChange('tagline', e.target.value)}
              placeholder="e.g., Crafting digital experiences that inspire"
              className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-lighter rounded-lg text-text-light placeholder:text-text-gray/50 focus:outline-none focus:border-rocket-red transition-colors"
              required
            />
            <p className="text-xs text-text-gray/70 mt-1">
              A short, catchy phrase that describes what you do
            </p>
          </div>
        </div>

        {/* Logo Upload */}
        <div className="bg-dark-card border-2 border-dark-lighter rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-text-light flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            Brand Assets
          </h3>

          <div>
            <label className="block text-text-light font-semibold mb-2">
              Logo (Optional)
            </label>

            {!logoPreview ? (
              <div className="border-2 border-dashed border-dark-lighter rounded-xl p-8 text-center hover:border-rocket-red/50 transition-colors">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/svg+xml,image/webp"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <div className="text-5xl mb-3">📁</div>
                  <p className="text-text-light font-medium mb-1">Click to upload logo</p>
                  <p className="text-sm text-text-gray">JPG, PNG, SVG, or WebP (max 5MB)</p>
                </label>
              </div>
            ) : (
              <div className="border-2 border-dark-lighter rounded-xl p-6 bg-dark-bg">
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-text-light font-medium mb-2">Logo uploaded successfully!</p>
                    <button
                      onClick={handleRemoveLogo}
                      className="text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove logo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {uploadError && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-sm text-red-400">{uploadError}</p>
              </div>
            )}
          </div>

          {/* Primary Color */}
          <div>
            <label className="block text-text-light font-semibold mb-2">
              Brand Primary Color (Optional)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={userContent.primaryColor || '#dc2626'}
                onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                className="w-16 h-16 rounded-lg cursor-pointer border-2 border-dark-lighter"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={userContent.primaryColor || '#dc2626'}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  placeholder="#dc2626"
                  className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-lighter rounded-lg text-text-light placeholder:text-text-gray/50 focus:outline-none focus:border-rocket-red transition-colors font-mono"
                />
                <p className="text-xs text-text-gray/70 mt-1">
                  Your brand's primary color (will override theme color)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-dark-card border-2 border-dark-lighter rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-text-light flex items-center gap-2">
            <span className="text-2xl">📞</span>
            Contact Information
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-text-light font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                value={userContent.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="contact@yourbusiness.com"
                className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-lighter rounded-lg text-text-light placeholder:text-text-gray/50 focus:outline-none focus:border-rocket-red transition-colors"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-text-light font-semibold mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={userContent.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-lighter rounded-lg text-text-light placeholder:text-text-gray/50 focus:outline-none focus:border-rocket-red transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-dark-card border-2 border-dark-lighter rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-text-light flex items-center gap-2">
            <span className="text-2xl">🌐</span>
            Social Media (Optional)
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Facebook */}
            <div>
              <label className="block text-text-light font-medium mb-2 flex items-center gap-2">
                <span className="text-lg">📘</span> Facebook
              </label>
              <input
                type="url"
                value={userContent.socialLinks?.facebook || ''}
                onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                placeholder="https://facebook.com/yourbusiness"
                className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-lighter rounded-lg text-text-light placeholder:text-text-gray/50 focus:outline-none focus:border-rocket-red transition-colors text-sm"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-text-light font-medium mb-2 flex items-center gap-2">
                <span className="text-lg">📷</span> Instagram
              </label>
              <input
                type="url"
                value={userContent.socialLinks?.instagram || ''}
                onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                placeholder="https://instagram.com/yourbusiness"
                className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-lighter rounded-lg text-text-light placeholder:text-text-gray/50 focus:outline-none focus:border-rocket-red transition-colors text-sm"
              />
            </div>

            {/* Twitter */}
            <div>
              <label className="block text-text-light font-medium mb-2 flex items-center gap-2">
                <span className="text-lg">🐦</span> Twitter / X
              </label>
              <input
                type="url"
                value={userContent.socialLinks?.twitter || ''}
                onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                placeholder="https://twitter.com/yourbusiness"
                className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-lighter rounded-lg text-text-light placeholder:text-text-gray/50 focus:outline-none focus:border-rocket-red transition-colors text-sm"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-text-light font-medium mb-2 flex items-center gap-2">
                <span className="text-lg">💼</span> LinkedIn
              </label>
              <input
                type="url"
                value={userContent.socialLinks?.linkedin || ''}
                onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/company/yourbusiness"
                className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-lighter rounded-lg text-text-light placeholder:text-text-gray/50 focus:outline-none focus:border-rocket-red transition-colors text-sm"
              />
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        {requiredFieldsFilled ? (
          <div className="bg-green-500/10 border-2 border-green-500/50 rounded-xl p-6 flex items-center gap-4 animate-fadeIn">
            <div className="text-3xl">✅</div>
            <div>
              <h4 className="font-bold text-green-400 mb-1">Required fields completed!</h4>
              <p className="text-sm text-text-gray">You can now proceed to the next step.</p>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-500/10 border-2 border-yellow-500/50 rounded-xl p-6 flex items-center gap-4 animate-fadeIn">
            <div className="text-3xl">⚠️</div>
            <div>
              <h4 className="font-bold text-yellow-400 mb-1">Almost there!</h4>
              <p className="text-sm text-text-gray">
                Please fill in your business name and tagline to continue.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
