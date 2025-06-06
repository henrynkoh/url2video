export interface VideoProject {
  id: string
  title: string
  description: string
  status: 'draft' | 'processing' | 'completed' | 'failed'
  createdAt: Date
  updatedAt: Date
  videoUrl?: string
  thumbnailUrl?: string
  duration?: number
  settings: VideoSettings
}

export interface VideoSettings {
  // Synthesia features
  avatar?: {
    type: 'ai' | 'custom'
    avatarId: string
    voice: string
    language: string
  }
  
  // InVideo features
  template?: {
    id: string
    category: 'youtube' | 'instagram' | 'tiktok' | 'facebook'
    style: string
  }
  
  // Pictory features
  contentSource?: {
    type: 'text' | 'url' | 'blog'
    content: string
    summarize: boolean
  }
  
  // Runway features
  cinematic?: {
    style: 'realistic' | 'artistic' | 'animated'
    motionBrush: boolean
    cameraControls: boolean
  }
  
  // Veed.io features
  subtitles?: {
    enabled: boolean
    language: string
    accuracy: number
    style: string
  }
  
  // Topview.ai features
  ecommerce?: {
    productUrl: string
    platform: 'amazon' | 'shopify' | 'general'
    viralHooks: boolean
  }
}

export interface AIAvatar {
  id: string
  name: string
  gender: 'male' | 'female'
  ethnicity: string
  style: 'professional' | 'casual' | 'animated'
  languages: string[]
  thumbnailUrl: string
}

export interface VideoTemplate {
  id: string
  name: string
  category: string
  platform: string
  thumbnailUrl: string
  duration: number
  elements: TemplateElement[]
}

export interface TemplateElement {
  id: string
  type: 'text' | 'image' | 'video' | 'audio'
  position: { x: number; y: number }
  size: { width: number; height: number }
  properties: Record<string, any>
}

export interface ProcessingJob {
  id: string
  projectId: string
  type: 'text-to-video' | 'url-to-video' | 'image-to-video' | 'content-summary'
  status: 'queued' | 'processing' | 'completed' | 'failed'
  progress: number
  result?: {
    videoUrl: string
    thumbnailUrl: string
    duration: number
  }
  error?: string
}

export interface N8nWorkflow {
  id: string
  name: string
  description: string
  triggers: WorkflowTrigger[]
  actions: WorkflowAction[]
  active: boolean
}

export interface WorkflowTrigger {
  type: 'webhook' | 'schedule' | 'content-update'
  config: Record<string, any>
}

export interface WorkflowAction {
  type: 'generate-video' | 'process-content' | 'send-notification'
  config: Record<string, any>
}

export interface MCPConnection {
  id: string
  name: string
  endpoint: string
  apiKey: string
  capabilities: string[]
  status: 'connected' | 'disconnected' | 'error'
} 