'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import AvatarSelector from '@/components/AvatarSelector'
import BottomControlBar from '@/components/BottomControlBar'
import { Play, Pause, User, Video, Zap } from 'lucide-react'

interface VideoEditorProps {
  analysisResult: any
  isOpen: boolean
  onClose: () => void
  onExport: () => void
}

export default function VideoEditor({ analysisResult, isOpen, onClose, onExport }: VideoEditorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<any>(null)
  const [showAvatarSelector, setShowAvatarSelector] = useState(false)
  const [scripts, setScripts] = useState(analysisResult.scripts || [])
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportStage, setExportStage] = useState('')

  const handleExport = async () => {
    if (!selectedAvatar) return
    
    setIsExporting(true)
    setExportProgress(0)
    setExportStage('Starting export...')
    
    try {
      const response = await fetch('/api/export-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: analysisResult.title,
          scripts,
          avatar: selectedAvatar,
          mediaItems: analysisResult.mediaItems || [],
          settings: {
            lipSyncEnabled: true,
            voiceSpeed: 1.0,
            backgroundMusic: 'upbeat'
          }
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Poll for progress
        pollExportProgress(result.jobId)
      }
    } catch (error) {
      console.error('Export failed:', error)
      setIsExporting(false)
    }
  }

  const pollExportProgress = async (jobId: string) => {
    try {
      const response = await fetch(`/api/export-video?jobId=${jobId}`)
      const result = await response.json()
      
      if (result.job) {
        setExportProgress(result.job.progress)
        setExportStage(result.job.stage)
        
        if (result.job.status === 'completed') {
          setIsExporting(false)
          onExport()
        } else if (result.job.status === 'processing') {
          setTimeout(() => pollExportProgress(jobId), 2000)
        }
      }
    } catch (error) {
      console.error('Failed to poll export progress:', error)
      setIsExporting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-gray-900 border-r border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-white mb-4">AI Presenter</h3>
        
        {selectedAvatar ? (
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <img 
                src={selectedAvatar.thumbnail}
                alt={selectedAvatar.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <p className="text-white font-medium">{selectedAvatar.name}</p>
                <p className="text-xs text-gray-400">{selectedAvatar.description}</p>
              </div>
            </div>
          </div>
        ) : (
          <Button 
            onClick={() => setShowAvatarSelector(true)}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <User className="w-4 h-4 mr-2" />
            Select AI Avatar
          </Button>
        )}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-900 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">{analysisResult.title}</h2>
            <Button onClick={onClose} variant="ghost">✕</Button>
          </div>
        </div>
        
        <div className="flex-1 bg-black flex items-center justify-center">
          <div className="w-full max-w-4xl aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
            {selectedAvatar ? (
              <div className="text-center">
                <img 
                  src={selectedAvatar.thumbnail}
                  alt={selectedAvatar.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <p className="text-white text-lg">{selectedAvatar.name} Presenting</p>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <Video className="w-16 h-16 mx-auto mb-4" />
                <p>Select an AI Avatar to preview your video</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-900 border-t border-gray-700 p-4 pb-20">
          <div className="flex justify-end">
            <Button 
              onClick={handleExport}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={!selectedAvatar || isExporting}
            >
              <Zap className="w-4 h-4 mr-2" />
              {isExporting ? `Exporting... ${exportProgress}%` : 'Generate Video'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Right Sidebar - Scripts */}
      <div className="w-96 bg-gray-900 border-l border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Video Script</h3>
        
        <div className="space-y-4">
          {scripts.map((script: any, index: number) => (
            <Card key={script.id} className="bg-gray-800 border-gray-700 p-4">
              <h4 className="text-white font-medium mb-2">{script.title}</h4>
              <textarea
                value={script.content}
                onChange={(e) => {
                  const newScripts = [...scripts]
                  newScripts[index].content = e.target.value
                  setScripts(newScripts)
                }}
                className="w-full bg-gray-700 text-white text-sm rounded p-3 border border-gray-600 resize-none"
                rows={4}
              />
            </Card>
          ))}
        </div>
      </div>
      
      {showAvatarSelector && (
        <AvatarSelector
          selectedAvatar={selectedAvatar}
          onAvatarSelect={(avatar) => {
            setSelectedAvatar(avatar)
            setShowAvatarSelector(false)
          }}
          onClose={() => setShowAvatarSelector(false)}
        />
      )}
      
      {/* Bottom Control Bar */}
      <BottomControlBar
        onGenerate={handleExport}
        onThink={() => {
          console.log('🤔 AI is optimizing your video script...')
        }}
        isGenerating={isExporting}
      />
    </div>
  )
} 