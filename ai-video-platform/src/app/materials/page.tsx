'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { 
  ArrowLeft,
  Globe,
  Upload,
  Brain,
  FolderOpen,
  Loader2,
  Sparkles,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Flag,
  Volume2
} from 'lucide-react'
import Link from 'next/link'
import VideoEditor from '@/components/VideoEditor'

// Language options with flag emojis
const LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' }
]

// Voice options with colored indicators
const VOICE_OPTIONS = [
  { id: 'alloy', name: 'Alloy', color: 'bg-blue-500' },
  { id: 'echo', name: 'Echo', color: 'bg-green-500' },
  { id: 'fable', name: 'Fable', color: 'bg-purple-500' },
  { id: 'onyx', name: 'Onyx', color: 'bg-gray-700' },
  { id: 'nova', name: 'Nova', color: 'bg-pink-500' },
  { id: 'shimmer', name: 'Shimmer', color: 'bg-yellow-500' },
  { id: 'violet', name: 'Violet', color: 'bg-violet-500' }
]

// Avatar options
const AVATAR_OPTIONS = [
  { id: 'none', name: 'No avatar' },
  { id: 'female1', name: 'Sarah - Professional' },
  { id: 'male1', name: 'Alex - Friendly' },
  { id: 'female2', name: 'Emma - Energetic' },
  { id: 'male2', name: 'David - Authoritative' }
]

export default function MaterialsToVideo() {
  const [inputLink, setInputLink] = useState('https://www.amazon.com/Shark-AV2511AE-Self-Empty-Capacity-Navigation/dp/B08KLSQSTB')
  const [productName, setProductName] = useState('')
  const [productScript, setProductScript] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedOption, setSelectedOption] = useState<'link' | 'upload' | 'ai' | 'assets' | null>(null)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [jobId, setJobId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showVideoEditor, setShowVideoEditor] = useState(false)
  
  // Script mode toggle
  const [scriptMode, setScriptMode] = useState<'details' | 'custom'>('details')
  
  // More options toggle
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  
  // Bottom control bar settings
  const [aspectRatio, setAspectRatio] = useState('9:16')
  const [language, setLanguage] = useState('en')
  const [voice, setVoice] = useState('violet')
  const [avatar, setAvatar] = useState('none')
  
  // Dropdown states
  const [showAspectDropdown, setShowAspectDropdown] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [showVoiceDropdown, setShowVoiceDropdown] = useState(false)
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false)
  
  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Dropdown refs for click outside
  const aspectDropdownRef = useRef<HTMLDivElement>(null)
  const languageDropdownRef = useRef<HTMLDivElement>(null)
  const voiceDropdownRef = useRef<HTMLDivElement>(null)
  const avatarDropdownRef = useRef<HTMLDivElement>(null)

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (aspectDropdownRef.current && !aspectDropdownRef.current.contains(event.target as Node)) {
        setShowAspectDropdown(false)
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false)
      }
      if (voiceDropdownRef.current && !voiceDropdownRef.current.contains(event.target as Node)) {
        setShowVoiceDropdown(false)
      }
      if (avatarDropdownRef.current && !avatarDropdownRef.current.contains(event.target as Node)) {
        setShowAvatarDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setShowAspectDropdown(false)
    setShowLanguageDropdown(false)
    setShowVoiceDropdown(false)
    setShowAvatarDropdown(false)
  }

  const handleTrySample = async () => {
    const sampleUrl = 'https://www.amazon.com/Shark-AV2511AE-Self-Empty-Capacity-Navigation/dp/B08KLSQSTB'
    setInputLink(sampleUrl)
    setSelectedOption('link')
    
    setIsProcessing(true)
    setError(null)
    
    try {
      const response = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: sampleUrl })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze sample URL')
      }

      setAnalysisData(data)
      setProductName(data.title || 'Amazon Shark Vacuum Cleaner')
      
      const combinedScript = data.scripts?.map((section: any) => section.content).join('\n\n') || 
                           'Meet the Shark AV2511AE - the revolutionary self-emptying robot vacuum that\'s changing how we clean! With advanced navigation technology and a bagless, self-emptying base, this isn\'t just a vacuum - it\'s your personal cleaning assistant. Experience powerful suction, intelligent mapping, and up to 60 days of hands-free cleaning. Join thousands of satisfied customers who have already upgraded their cleaning routine!'
      
      setProductScript(combinedScript)
      
      console.log('✅ Sample URL analysis completed:', data)
    } catch (err) {
      console.error('❌ Error analyzing sample URL:', err)
      setError(err instanceof Error ? err.message : 'Failed to analyze sample URL')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleImportFromLink = async () => {
    if (!inputLink.trim()) return
    
    setIsProcessing(true)
    setSelectedOption('link')
    setError(null)
    closeAllDropdowns()
    
    try {
      const response = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: inputLink })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze URL')
      }

      setAnalysisData(data)
      setProductName(data.title || 'Video Content')
      
      const combinedScript = data.scripts?.map((section: any) => section.content).join('\n\n') || 
                           data.description || 
                           'Amazing content that deserves to be shared! This video will showcase the best features and benefits in an engaging way.'
      
      setProductScript(combinedScript)
      
      if (data.fallbackReason) {
        setError(`ℹ️ Used smart analysis: ${data.fallbackReason}. You can edit the content below.`)
      }
      
      console.log('✅ URL analysis completed:', data)
    } catch (err) {
      console.error('❌ Error analyzing URL:', err)
      setError(err instanceof Error ? err.message : 'Failed to analyze URL')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUploadFile = () => {
    closeAllDropdowns()
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedOption('upload')
      setProductName(`Video from ${file.name}`)
      setProductScript(`Content imported from ${file.name}. This will be processed and optimized for video creation with advanced AI techniques to ensure professional quality output.`)
    }
  }

  const handleAICreate = () => {
    closeAllDropdowns()
    setSelectedOption('ai')
    setProductName('AI Generated Content')
    setProductScript('AI will generate compelling content based on your preferences and trending topics. Our advanced algorithms will create engaging narratives that resonate with your target audience.')
  }

  const handleImportFromAssets = () => {
    closeAllDropdowns()
    setSelectedOption('assets')
    setProductName('Content from Asset Library')
    setProductScript('Select from your existing asset library to create professional videos. Choose from high-quality templates, images, and pre-made content to streamline your video creation process.')
  }

  const handleGenerate = async () => {
    if (!productName.trim()) return
    
    closeAllDropdowns()
    setIsProcessing(true)
    setError(null)
    setProgress(0)
    setStage('Starting video generation...')
    
    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: productName,
          script: productScript,
          sourceUrl: selectedOption === 'link' ? inputLink : undefined,
          settings: {
            aspectRatio,
            language: LANGUAGE_OPTIONS.find(l => l.code === language)?.name || 'English',
            voice,
            avatar
          }
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to start video generation')
      }

      if (result.success) {
        setJobId(result.jobId)
        console.log('🎬 Video generation started:', result.jobId)
        pollJobProgress(result.jobId)
      }
    } catch (err) {
      console.error('❌ Error generating video:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate video')
      setIsProcessing(false)
    }
  }

  const pollJobProgress = async (jobId: string) => {
    try {
      const response = await fetch(`/api/generate-video?jobId=${jobId}`)
      const result = await response.json()

      if (response.ok && result.job) {
        const job = result.job
        
        // Animate progress changes smoothly
        const currentProgress = progress
        const newProgress = job.progress
        
        if (newProgress > currentProgress) {
          // Animate progress increment over 500ms
          const increment = newProgress - currentProgress
          const steps = 10
          const stepSize = increment / steps
          let step = 0
          
          const animateProgress = () => {
            if (step < steps) {
              setProgress(Math.round(currentProgress + (stepSize * step)))
              step++
              setTimeout(animateProgress, 50)
            } else {
              setProgress(newProgress)
            }
          }
          animateProgress()
        } else {
          setProgress(newProgress)
        }
        
        setStage(job.stage)

        if (job.status === 'completed') {
          setProgress(100)
          setStage('Video generation complete! 🎉')
          setTimeout(() => {
            setIsProcessing(false)
            console.log('✅ Video generation completed!')
          }, 1000)
        } else if (job.status === 'failed') {
          setError(job.error || 'Video generation failed')
          setIsProcessing(false)
        } else if (job.status === 'processing') {
          // Poll more frequently for smoother updates
          setTimeout(() => pollJobProgress(jobId), 1000)
        }
      }
    } catch (err) {
      console.error('❌ Error polling job progress:', err)
      setError('Failed to track video generation progress')
      setIsProcessing(false)
    }
  }

  const handleThink = () => {
    console.log('🤔 AI is thinking about optimizations...')
    closeAllDropdowns()
    
    // Simulate AI thinking process
    setIsProcessing(true)
    setStage('AI is analyzing your content for optimization opportunities...')
    
    setTimeout(() => {
      setIsProcessing(false)
      setStage('')
      
      // Add AI suggestions
      if (productScript.length < 100) {
        setError('💡 AI Suggestion: Consider expanding your script for better engagement. Aim for 200-500 words for optimal video length.')
      } else if (productScript.length > 1000) {
        setError('💡 AI Suggestion: Your script might be too long. Consider breaking it into key points for better viewer retention.')
      } else {
        setError('✨ AI Analysis: Your content looks great! Ready for video generation.')
      }
    }, 2000)
  }

  const selectedLanguage = LANGUAGE_OPTIONS.find(l => l.code === language)
  const selectedVoice = VOICE_OPTIONS.find(v => v.id === voice)
  const selectedAvatar = AVATAR_OPTIONS.find(a => a.id === avatar)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <div className="text-lg font-bold text-blue-500">TOPVIEW</div>
            </div>
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">Materials to Video</h1>
              <Button
                onClick={handleTrySample}
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-gray-800"
                disabled={isProcessing}
              >
                Try sample
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 pb-32">
        {/* Error Display */}
        {error && (
          <div className="flex items-center space-x-3 p-4 mb-6 bg-red-900/20 border border-red-800 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300">{error}</span>
            <Button
              onClick={() => setError(null)}
              size="sm"
              variant="ghost"
              className="ml-auto text-red-400 hover:text-red-300"
            >
              ×
            </Button>
          </div>
        )}

        {/* Success Display */}
        {selectedOption && !error && (
          <div className="flex items-center space-x-3 p-4 mb-6 bg-green-900/20 border border-green-800 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-300">
              Content imported successfully from {selectedOption === 'link' ? 'URL' : selectedOption === 'upload' ? 'file' : selectedOption === 'ai' ? 'AI' : 'assets'}!
            </span>
          </div>
        )}

        {/* Import Materials Section */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Import Materials</h2>
            
            {/* URL Input Section */}
            <div className="flex items-center space-x-4 bg-gray-800 border border-gray-600 rounded-lg p-4 mb-8">
              <Globe className="w-5 h-5 text-gray-400 shrink-0" />
              <Input
                value={inputLink}
                onChange={(e) => setInputLink(e.target.value)}
                className="flex-1 bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 text-base"
                placeholder="Enter URL or paste link here"
                disabled={isProcessing}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isProcessing && inputLink.trim()) {
                    handleImportFromLink()
                  }
                }}
              />
              <Button 
                onClick={handleImportFromLink}
                disabled={isProcessing || !inputLink.trim()}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-2"
              >
                {isProcessing && progress === 0 ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : isProcessing && progress > 0 ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {progress}%
                  </>
                ) : (
                  'Import from Link'
                )}
              </Button>
            </div>

            {/* Import Options Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card 
                className="p-8 bg-gray-800 border-gray-600 cursor-pointer hover:bg-gray-750 transition-all duration-200 hover:border-gray-500 hover:shadow-lg" 
                onClick={handleUploadFile}
              >
                <div className="text-center">
                  <div className="mb-4">
                    <Upload className="w-12 h-12 mx-auto text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Upload File</h3>
                  <p className="text-gray-400 text-sm">(mp4, mov, png, jpg, bmp, webp)</p>
                </div>
              </Card>

              <Card 
                className="p-8 bg-gray-800 border-gray-600 cursor-pointer hover:bg-gray-750 transition-all duration-200 hover:border-gray-500 hover:shadow-lg" 
                onClick={handleAICreate}
              >
                <div className="text-center">
                  <div className="mb-4">
                    <Brain className="w-12 h-12 mx-auto text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">AI Create</h3>
                  <p className="text-gray-400 text-sm">Generate with AI assistance</p>
                </div>
              </Card>

              <Card 
                className="p-8 bg-gray-800 border-gray-600 cursor-pointer hover:bg-gray-750 transition-all duration-200 hover:border-gray-500 hover:shadow-lg" 
                onClick={handleImportFromAssets}
              >
                <div className="text-center">
                  <div className="mb-4">
                    <FolderOpen className="w-12 h-12 mx-auto text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Import from Assets</h3>
                  <p className="text-gray-400 text-sm">Use existing asset library</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-lg font-medium mb-3 text-white">Product Name</label>
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white text-base p-4 h-12"
                placeholder="Your product name or video topic"
              />
            </div>

            {/* Script Mode Toggle */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button
                  onClick={() => setScriptMode('details')}
                  className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                    scriptMode === 'details' 
                      ? 'bg-gray-700 text-white border border-gray-500' 
                      : 'bg-transparent text-gray-400 border border-gray-600 hover:text-white hover:border-gray-500'
                  }`}
                >
                  Product Details for The Script
                </Button>
                <Button
                  onClick={() => setScriptMode('custom')}
                  className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                    scriptMode === 'custom' 
                      ? 'bg-gray-700 text-white border border-gray-500' 
                      : 'bg-transparent text-gray-400 border border-gray-600 hover:text-white hover:border-gray-500'
                  }`}
                >
                  Use My Script
                </Button>
              </div>

              {/* Script Content Area */}
              <div className="relative">
                <textarea
                  value={productScript}
                  onChange={(e) => setProductScript(e.target.value)}
                  className="w-full h-48 p-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    scriptMode === 'details' 
                      ? "Describe the features of your product/service/application."
                      : "Enter your custom script here..."
                  }
                  maxLength={5000}
                />
                <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                  {productScript.length}/5000
                </div>
              </div>
            </div>

            {/* More Options */}
            <div className="border-t border-gray-700 pt-6">
              <Button
                onClick={() => setShowMoreOptions(!showMoreOptions)}
                variant="ghost"
                className="flex items-center space-x-2 text-gray-300 hover:text-white p-0"
              >
                {showMoreOptions ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                <span>More Options</span>
              </Button>

              {showMoreOptions && (
                <div className="mt-4 p-6 bg-gray-800 border border-gray-600 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Video Duration</label>
                      <select className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white">
                        <option>Auto (15-60s)</option>
                        <option>15 seconds</option>
                        <option>30 seconds</option>
                        <option>60 seconds</option>
                        <option>90 seconds</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Video Style</label>
                      <select className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white">
                        <option>Professional</option>
                        <option>Casual</option>
                        <option>Dynamic</option>
                        <option>Minimalist</option>
                        <option>Cinematic</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Background Music</label>
                      <select className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white">
                        <option>Auto Select</option>
                        <option>Upbeat</option>
                        <option>Corporate</option>
                        <option>Ambient</option>
                        <option>No Music</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Text Overlay</label>
                      <select className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white">
                        <option>Auto Generate</option>
                        <option>Key Points Only</option>
                        <option>Full Script</option>
                        <option>No Text</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Display */}
        {isProcessing && progress > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="relative">
              <div className="relative">
                <Loader2 className="w-16 h-16 animate-spin text-blue-400" />
                {/* Progress circle overlay */}
                <svg className="absolute inset-0 w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-gray-600"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="text-blue-400 transition-all duration-500"
                    style={{
                      strokeDasharray: '175.929',
                      strokeDashoffset: `${175.929 - (175.929 * progress) / 100}`
                    }}
                  />
                </svg>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white bg-gray-900/80 px-2 py-1 rounded backdrop-blur-sm">
                  {progress}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Aspect Ratio */}
            <div className="relative" ref={aspectDropdownRef}>
              <Button
                onClick={() => {
                  setShowLanguageDropdown(false)
                  setShowVoiceDropdown(false)
                  setShowAvatarDropdown(false)
                  setShowAspectDropdown(!showAspectDropdown)
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 px-4 py-2 flex items-center space-x-2"
              >
                <span>{aspectRatio}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              {showAspectDropdown && (
                <div className="absolute bottom-full mb-2 left-0 bg-gray-700 border border-gray-600 rounded-lg shadow-lg min-w-[120px] z-50">
                  {['9:16', '16:9', '1:1', '4:5'].map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => {
                        setAspectRatio(ratio)
                        setShowAspectDropdown(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-600 text-white first:rounded-t-lg last:rounded-b-lg"
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language */}
            <div className="relative" ref={languageDropdownRef}>
              <Button
                onClick={() => {
                  setShowAspectDropdown(false)
                  setShowVoiceDropdown(false)
                  setShowAvatarDropdown(false)
                  setShowLanguageDropdown(!showLanguageDropdown)
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 px-4 py-2 flex items-center space-x-2"
              >
                <span>{selectedLanguage?.flag}</span>
                <span>{selectedLanguage?.name}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              {showLanguageDropdown && (
                <div className="absolute bottom-full mb-2 left-0 bg-gray-700 border border-gray-600 rounded-lg shadow-lg min-w-[160px] max-h-60 overflow-y-auto z-50">
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code)
                        setShowLanguageDropdown(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-600 text-white flex items-center space-x-2 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Voice */}
            <div className="relative" ref={voiceDropdownRef}>
              <Button
                onClick={() => {
                  setShowAspectDropdown(false)
                  setShowLanguageDropdown(false)
                  setShowAvatarDropdown(false)
                  setShowVoiceDropdown(!showVoiceDropdown)
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 px-4 py-2 flex items-center space-x-2"
              >
                <div className={`w-3 h-3 rounded-full ${selectedVoice?.color}`}></div>
                <span>{selectedVoice?.name}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              {showVoiceDropdown && (
                <div className="absolute bottom-full mb-2 left-0 bg-gray-700 border border-gray-600 rounded-lg shadow-lg min-w-[140px] z-50">
                  {VOICE_OPTIONS.map((voiceOption) => (
                    <button
                      key={voiceOption.id}
                      onClick={() => {
                        setVoice(voiceOption.id)
                        setShowVoiceDropdown(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-600 text-white flex items-center space-x-2 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <div className={`w-3 h-3 rounded-full ${voiceOption.color}`}></div>
                      <span>{voiceOption.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className="relative" ref={avatarDropdownRef}>
              <Button
                onClick={() => {
                  setShowAspectDropdown(false)
                  setShowLanguageDropdown(false)
                  setShowVoiceDropdown(false)
                  setShowAvatarDropdown(!showAvatarDropdown)
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 px-4 py-2 flex items-center space-x-2"
              >
                <span>{selectedAvatar?.name}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              {showAvatarDropdown && (
                <div className="absolute bottom-full mb-2 left-0 bg-gray-700 border border-gray-600 rounded-lg shadow-lg min-w-[180px] z-50">
                  {AVATAR_OPTIONS.map((avatarOption) => (
                    <button
                      key={avatarOption.id}
                      onClick={() => {
                        setAvatar(avatarOption.id)
                        setShowAvatarDropdown(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-600 text-white first:rounded-t-lg last:rounded-b-lg"
                    >
                      {avatarOption.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleThink}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 px-6 py-2"
              disabled={isProcessing}
            >
              Think
            </Button>
            <Button
              onClick={handleGenerate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              disabled={isProcessing || !productName.trim()}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {progress > 0 ? `Generating... ${progress}%` : 'Generating...'}
                </>
              ) : (
                'Generate'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,audio/*,image/*,text/*,application/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Video Editor Modal */}
      {showVideoEditor && analysisData && (
        <VideoEditor
          analysisResult={analysisData}
          isOpen={showVideoEditor}
          onClose={() => setShowVideoEditor(false)}
          onExport={() => {
            setShowVideoEditor(false)
            console.log('🎬 Exporting enhanced video...')
          }}
        />
      )}
    </div>
  )
} 