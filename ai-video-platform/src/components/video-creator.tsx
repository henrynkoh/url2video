'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { VideoSettings, VideoProject } from '@/types'
import { generateId } from '@/lib/utils'
import { 
  Video, 
  User, 
  Globe, 
  FileText, 
  Camera, 
  Subtitles, 
  ShoppingCart,
  Wand2,
  Play,
  Upload
} from 'lucide-react'

interface VideoCreatorProps {
  onCreateProject: (project: VideoProject) => void
}

export function VideoCreator({ onCreateProject }: VideoCreatorProps) {
  const [activeTab, setActiveTab] = useState<string>('synthesia')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    textContent: '',
    productUrl: '',
    blogUrl: '',
    selectedAvatar: '',
    selectedLanguage: 'en',
    selectedTemplate: '',
    selectedStyle: 'realistic'
  })

  const tabs = [
    {
      id: 'synthesia',
      label: 'AI Avatar',
      icon: User,
      description: 'Create videos with lifelike AI avatars in 140+ languages'
    },
    {
      id: 'invideo',
      label: 'Templates',
      icon: Video,
      description: 'Use 5,000+ templates for social media platforms'
    },
    {
      id: 'pictory',
      label: 'Content to Video',
      icon: FileText,
      description: 'Transform blogs and URLs into engaging video clips'
    },
    {
      id: 'runway',
      label: 'Cinematic AI',
      icon: Camera,
      description: 'Generate cinematic videos with advanced AI'
    },
    {
      id: 'veed',
      label: 'Subtitles & Translation',
      icon: Subtitles,
      description: 'Auto-subtitles with 98% accuracy in 100+ languages'
    },
    {
      id: 'topview',
      label: 'E-commerce',
      icon: ShoppingCart,
      description: 'Convert product URLs to viral UGC-style videos'
    }
  ]

  const handleCreateProject = () => {
    const settings: VideoSettings = {}

    // Configure settings based on active tab
    switch (activeTab) {
      case 'synthesia':
        settings.avatar = {
          type: 'ai',
          avatarId: formData.selectedAvatar || 'default',
          voice: 'natural',
          language: formData.selectedLanguage
        }
        break
      case 'invideo':
        settings.template = {
          id: formData.selectedTemplate || 'youtube-default',
          category: 'youtube',
          style: formData.selectedStyle
        }
        break
      case 'pictory':
        settings.contentSource = {
          type: formData.blogUrl ? 'url' : 'text',
          content: formData.blogUrl || formData.textContent,
          summarize: true
        }
        break
      case 'runway':
        settings.cinematic = {
          style: formData.selectedStyle as 'realistic' | 'artistic' | 'animated',
          motionBrush: true,
          cameraControls: true
        }
        break
      case 'veed':
        settings.subtitles = {
          enabled: true,
          language: formData.selectedLanguage,
          accuracy: 98,
          style: 'modern'
        }
        break
      case 'topview':
        settings.ecommerce = {
          productUrl: formData.productUrl,
          platform: 'general',
          viralHooks: true
        }
        break
    }

    const project: VideoProject = {
      id: generateId(),
      title: formData.title || `New ${tabs.find(t => t.id === activeTab)?.label} Video`,
      description: formData.description,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      settings
    }

    onCreateProject(project)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'synthesia':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">AI Avatar</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {['avatar-1', 'avatar-2', 'avatar-3'].map((avatar) => (
                  <Button
                    key={avatar}
                    variant={formData.selectedAvatar === avatar ? 'default' : 'outline'}
                    className="h-20 flex-col"
                    onClick={() => setFormData(prev => ({ ...prev, selectedAvatar: avatar }))}
                  >
                    <User className="w-6 h-6 mb-1" />
                    <span className="text-xs">{avatar}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Language</label>
              <select 
                className="w-full mt-1 p-2 border rounded-md"
                value={formData.selectedLanguage}
                onChange={(e) => setFormData(prev => ({ ...prev, selectedLanguage: e.target.value }))}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
          </div>
        )

      case 'invideo':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Template Category</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['YouTube', 'Instagram', 'TikTok', 'Facebook'].map((platform) => (
                  <Button
                    key={platform}
                    variant={formData.selectedTemplate === platform ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({ ...prev, selectedTemplate: platform }))}
                  >
                    {platform}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Style</label>
              <select 
                className="w-full mt-1 p-2 border rounded-md"
                value={formData.selectedStyle}
                onChange={(e) => setFormData(prev => ({ ...prev, selectedStyle: e.target.value }))}
              >
                <option value="modern">Modern</option>
                <option value="minimal">Minimal</option>
                <option value="bold">Bold</option>
                <option value="creative">Creative</option>
              </select>
            </div>
          </div>
        )

      case 'pictory':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Content Source</label>
              <div className="space-y-2 mt-2">
                <Input
                  placeholder="Enter blog URL..."
                  value={formData.blogUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, blogUrl: e.target.value }))}
                />
                <div className="text-center text-sm text-muted-foreground">OR</div>
                <Textarea
                  placeholder="Paste your text content here..."
                  value={formData.textContent}
                  onChange={(e) => setFormData(prev => ({ ...prev, textContent: e.target.value }))}
                  rows={6}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="summarize" defaultChecked />
              <label htmlFor="summarize" className="text-sm">Auto-summarize content</label>
            </div>
          </div>
        )

      case 'runway':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Cinematic Style</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {['realistic', 'artistic', 'animated'].map((style) => (
                  <Button
                    key={style}
                    variant={formData.selectedStyle === style ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({ ...prev, selectedStyle: style }))}
                  >
                    {style}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="motionBrush" defaultChecked />
                <label htmlFor="motionBrush" className="text-sm">Motion Brush</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="cameraControls" defaultChecked />
                <label htmlFor="cameraControls" className="text-sm">Camera Controls</label>
              </div>
            </div>
          </div>
        )

      case 'veed':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Subtitle Language</label>
              <select 
                className="w-full mt-1 p-2 border rounded-md"
                value={formData.selectedLanguage}
                onChange={(e) => setFormData(prev => ({ ...prev, selectedLanguage: e.target.value }))}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="autoSubtitles" defaultChecked />
                <label htmlFor="autoSubtitles" className="text-sm">Auto-generate subtitles (98% accuracy)</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="translation" />
                <label htmlFor="translation" className="text-sm">Enable multi-language translation</label>
              </div>
            </div>
          </div>
        )

      case 'topview':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Product URL</label>
              <Input
                placeholder="Enter Amazon, Shopify, or product URL..."
                value={formData.productUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, productUrl: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="viralHooks" defaultChecked />
                <label htmlFor="viralHooks" className="text-sm">Generate viral script hooks</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="ugcStyle" defaultChecked />
                <label htmlFor="ugcStyle" className="text-sm">UGC-style presentation</label>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-6 h-6" />
          AI Video Creator
        </CardTitle>
        <CardDescription>
          Create professional videos using AI-powered tools from multiple platforms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Details */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Project Title</label>
            <Input
              placeholder="Enter project title..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Describe your video project..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
        </div>

        {/* Feature Tabs */}
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'outline'}
                  className="h-auto p-3 flex-col space-y-1"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </Button>
              )
            })}
          </div>

          {/* Active Tab Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {tabs.find(t => t.id === activeTab)?.label}
              </CardTitle>
              <CardDescription>
                {tabs.find(t => t.id === activeTab)?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderTabContent()}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handleCreateProject} className="flex-1">
            <Play className="w-4 h-4 mr-2" />
            Create Video Project
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload Media
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 