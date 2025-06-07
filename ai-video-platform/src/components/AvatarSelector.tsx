'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, Play, Volume2, Crown } from 'lucide-react'

interface Avatar {
  id: string
  name: string
  type: 'realistic' | 'animated' | 'ai'
  thumbnail: string
  voices: string[]
  premium: boolean
  description: string
  tags: string[]
}

interface AvatarSelectorProps {
  selectedAvatar: Avatar | null
  onAvatarSelect: (avatar: Avatar) => void
  onClose: () => void
}

// Mock avatar data
const avatars: Avatar[] = [
  {
    id: 'sarah-professional',
    name: 'Sarah Chen',
    type: 'realistic',
    thumbnail: '/api/placeholder/200/300',
    voices: ['Professional Female', 'Friendly Female'],
    premium: true,
    description: 'Professional presenter perfect for business content',
    tags: ['Business', 'Tech', 'Professional']
  },
  {
    id: 'marcus-friendly',
    name: 'Marcus Johnson',
    type: 'realistic',
    thumbnail: '/api/placeholder/200/300',
    voices: ['Friendly Male', 'Enthusiastic Male'],
    premium: false,
    description: 'Engaging presenter great for lifestyle products',
    tags: ['Lifestyle', 'Products', 'Engaging']
  }
]

export default function AvatarSelector({ selectedAvatar, onAvatarSelect, onClose }: AvatarSelectorProps) {
  const [selectedVoice, setSelectedVoice] = useState<{[key: string]: string}>({})

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Choose Your AI Avatar</h2>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {avatars.map((avatar) => (
              <Card 
                key={avatar.id} 
                className={`bg-gray-800 border-2 transition-all cursor-pointer ${
                  selectedAvatar?.id === avatar.id 
                    ? 'border-purple-500' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="p-4">
                  <div className="relative mb-4">
                    <img 
                      src={avatar.thumbnail}
                      alt={avatar.name}
                      className="w-full aspect-[3/4] object-cover rounded-lg"
                    />
                    {avatar.premium && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center">
                        <Crown className="w-3 h-3 mr-1" />
                        PRO
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-1">{avatar.name}</h3>
                  <p className="text-sm text-gray-400 mb-2">{avatar.description}</p>
                  
                  <Button
                    onClick={() => onAvatarSelect(avatar)}
                    className={`w-full ${
                      selectedAvatar?.id === avatar.id
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {selectedAvatar?.id === avatar.id ? 'Selected' : 'Select Avatar'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-700">
          <div className="flex justify-end space-x-3">
            <Button onClick={onClose} variant="ghost">Cancel</Button>
            <Button 
              onClick={onClose}
              disabled={!selectedAvatar}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 