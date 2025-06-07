'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  ChevronDown, 
  Clock, 
  Globe, 
  Volume2, 
  User, 
  Sparkles, 
  Zap 
} from 'lucide-react'

interface BottomControlBarProps {
  onGenerate: () => void
  onThink?: () => void
  isGenerating?: boolean
}

interface DropdownOption {
  id: string
  label: string
  flag?: string
  icon?: React.ReactNode
}

export default function BottomControlBar({ onGenerate, onThink, isGenerating = false }: BottomControlBarProps) {
  const [selectedDuration, setSelectedDuration] = useState('9:16')
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const [selectedVoice, setSelectedVoice] = useState('Violet')
  const [selectedAvatar, setSelectedAvatar] = useState('No avatar')
  const [showDurationMenu, setShowDurationMenu] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showVoiceMenu, setShowVoiceMenu] = useState(false)
  const [showAvatarMenu, setShowAvatarMenu] = useState(false)

  const durationOptions: DropdownOption[] = [
    { id: '9:16', label: '9:16' },
    { id: '16:9', label: '16:9' },
    { id: '1:1', label: '1:1' },
    { id: '4:5', label: '4:5' }
  ]

  const languageOptions: DropdownOption[] = [
    { id: 'english', label: 'English', flag: '🇺🇸' },
    { id: 'spanish', label: 'Spanish', flag: '🇪🇸' },
    { id: 'french', label: 'French', flag: '🇫🇷' },
    { id: 'german', label: 'German', flag: '🇩🇪' },
    { id: 'chinese', label: 'Chinese', flag: '🇨🇳' },
    { id: 'japanese', label: 'Japanese', flag: '🇯🇵' },
    { id: 'korean', label: 'Korean', flag: '🇰🇷' }
  ]

  const voiceOptions: DropdownOption[] = [
    { id: 'violet', label: 'Violet', icon: <div className="w-3 h-3 bg-purple-500 rounded-full" /> },
    { id: 'sophia', label: 'Sophia', icon: <div className="w-3 h-3 bg-pink-500 rounded-full" /> },
    { id: 'james', label: 'James', icon: <div className="w-3 h-3 bg-blue-500 rounded-full" /> },
    { id: 'emma', label: 'Emma', icon: <div className="w-3 h-3 bg-green-500 rounded-full" /> },
    { id: 'david', label: 'David', icon: <div className="w-3 h-3 bg-orange-500 rounded-full" /> },
    { id: 'luna', label: 'Luna', icon: <div className="w-3 h-3 bg-indigo-500 rounded-full" /> }
  ]

  const avatarOptions: DropdownOption[] = [
    { id: 'none', label: 'No avatar' },
    { id: 'sarah', label: 'Sarah Chen' },
    { id: 'marcus', label: 'Marcus Johnson' },
    { id: 'emma', label: 'Emma Rodriguez' },
    { id: 'david', label: 'David Park' },
    { id: 'lisa', label: 'Lisa Virtual' },
    { id: 'alex', label: 'Alex AI' }
  ]

  const DropdownButton = ({ 
    icon, 
    label, 
    value, 
    options, 
    isOpen, 
    onToggle, 
    onSelect 
  }: {
    icon: React.ReactNode
    label: string
    value: string
    options: DropdownOption[]
    isOpen: boolean
    onToggle: () => void
    onSelect: (option: DropdownOption) => void
  }) => (
    <div className="relative">
      <Button
        onClick={onToggle}
        className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 px-3 py-2 h-auto min-w-[120px]"
      >
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-sm">{value}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </Button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={onToggle}
          />
          <div className="absolute bottom-full mb-2 left-0 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 min-w-[160px] max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onSelect(option)
                  onToggle()
                }}
                className="w-full px-3 py-2 text-left text-white hover:bg-gray-700 flex items-center space-x-2 text-sm"
              >
                {option.flag && <span>{option.flag}</span>}
                {option.icon && option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 px-6 py-4 z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left side - Control buttons */}
        <div className="flex items-center space-x-3">
          {/* Duration/Aspect Ratio */}
          <DropdownButton
            icon={<Clock className="w-4 h-4" />}
            label="Duration"
            value={selectedDuration}
            options={durationOptions}
            isOpen={showDurationMenu}
            onToggle={() => {
              setShowDurationMenu(!showDurationMenu)
              setShowLanguageMenu(false)
              setShowVoiceMenu(false)
              setShowAvatarMenu(false)
            }}
            onSelect={(option) => setSelectedDuration(option.label)}
          />

          {/* Language */}
          <DropdownButton
            icon={<Globe className="w-4 h-4" />}
            label="Language"
            value={selectedLanguage}
            options={languageOptions}
            isOpen={showLanguageMenu}
            onToggle={() => {
              setShowLanguageMenu(!showLanguageMenu)
              setShowDurationMenu(false)
              setShowVoiceMenu(false)
              setShowAvatarMenu(false)
            }}
            onSelect={(option) => setSelectedLanguage(option.label)}
          />

          {/* Voice */}
          <DropdownButton
            icon={<Volume2 className="w-4 h-4" />}
            label="Voice"
            value={selectedVoice}
            options={voiceOptions}
            isOpen={showVoiceMenu}
            onToggle={() => {
              setShowVoiceMenu(!showVoiceMenu)
              setShowDurationMenu(false)
              setShowLanguageMenu(false)
              setShowAvatarMenu(false)
            }}
            onSelect={(option) => setSelectedVoice(option.label)}
          />

          {/* Avatar */}
          <DropdownButton
            icon={<User className="w-4 h-4" />}
            label="Avatar"
            value={selectedAvatar}
            options={avatarOptions}
            isOpen={showAvatarMenu}
            onToggle={() => {
              setShowAvatarMenu(!showAvatarMenu)
              setShowDurationMenu(false)
              setShowLanguageMenu(false)
              setShowVoiceMenu(false)
            }}
            onSelect={(option) => setSelectedAvatar(option.label)}
          />
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center space-x-3">
          {/* Think Button */}
          {onThink && (
            <Button
              onClick={onThink}
              className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 px-4 py-2"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Think
            </Button>
          )}

          {/* Generate Button */}
          <Button
            onClick={onGenerate}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 font-medium"
          >
            <Zap className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </div>
    </div>
  )
} 