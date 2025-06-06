import { NextRequest, NextResponse } from 'next/server'
import { N8nWorkflow, VideoProject } from '@/types'

// Mock n8n workflows
let workflows: N8nWorkflow[] = [
  {
    id: 'workflow-1',
    name: 'Content to Video Pipeline',
    description: 'Automatically convert blog posts to videos',
    triggers: [
      {
        type: 'webhook',
        config: { url: '/api/webhooks/content-update' }
      }
    ],
    actions: [
      {
        type: 'process-content',
        config: { summarize: true, maxLength: 300 }
      },
      {
        type: 'generate-video',
        config: { template: 'youtube-short', avatar: 'default' }
      }
    ],
    active: true
  },
  {
    id: 'workflow-2',
    name: 'E-commerce Product Videos',
    description: 'Generate promotional videos from product URLs',
    triggers: [
      {
        type: 'schedule',
        config: { cron: '0 9 * * 1' } // Every Monday at 9 AM
      }
    ],
    actions: [
      {
        type: 'generate-video',
        config: { style: 'ugc', viralHooks: true }
      },
      {
        type: 'send-notification',
        config: { email: 'admin@company.com' }
      }
    ],
    active: false
  }
]

export async function GET() {
  return NextResponse.json(workflows)
}

export async function POST(request: NextRequest) {
  try {
    const { workflowId, data } = await request.json()
    
    const workflow = workflows.find(w => w.id === workflowId)
    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      )
    }
    
    if (!workflow.active) {
      return NextResponse.json(
        { error: 'Workflow is not active' },
        { status: 400 }
      )
    }
    
    // Execute workflow
    const result = await executeWorkflow(workflow, data)
    
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to execute workflow' },
      { status: 500 }
    )
  }
}

// Webhook endpoint for n8n triggers
export async function PUT(request: NextRequest) {
  try {
    const webhookData = await request.json()
    const { trigger, payload } = webhookData
    
    // Find workflows that match this trigger
    const matchingWorkflows = workflows.filter(w => 
      w.active && w.triggers.some(t => t.type === trigger)
    )
    
    const results = []
    for (const workflow of matchingWorkflows) {
      const result = await executeWorkflow(workflow, payload)
      results.push(result)
    }
    
    return NextResponse.json({ results })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}

async function executeWorkflow(workflow: N8nWorkflow, data: any) {
  console.log(`Executing workflow: ${workflow.name}`)
  
  const results = []
  
  for (const action of workflow.actions) {
    switch (action.type) {
      case 'process-content':
        const processedContent = await processContent(data, action.config)
        results.push({ action: 'process-content', result: processedContent })
        break
        
      case 'generate-video':
        const videoProject = await generateVideo(data, action.config)
        results.push({ action: 'generate-video', result: videoProject })
        break
        
      case 'send-notification':
        const notification = await sendNotification(data, action.config)
        results.push({ action: 'send-notification', result: notification })
        break
    }
  }
  
  return {
    workflowId: workflow.id,
    status: 'completed',
    results
  }
}

async function processContent(data: any, config: any) {
  // Simulate content processing
  const content = data.content || data.url || ''
  const processed = {
    originalLength: content.length,
    summarized: config.summarize ? content.substring(0, config.maxLength || 300) : content,
    keywords: ['AI', 'video', 'automation'],
    sentiment: 'positive'
  }
  
  return processed
}

async function generateVideo(data: any, config: any) {
  // Simulate video generation
  const videoProject: Partial<VideoProject> = {
    id: `video-${Date.now()}`,
    title: data.title || 'Generated Video',
    description: data.description || 'Auto-generated video from workflow',
    status: 'processing',
    createdAt: new Date(),
    updatedAt: new Date(),
    settings: {
      template: config.template ? {
        id: config.template,
        category: 'youtube',
        style: config.style || 'modern'
      } : undefined,
      avatar: config.avatar ? {
        type: 'ai',
        avatarId: config.avatar,
        voice: 'natural',
        language: 'en'
      } : undefined,
      ecommerce: config.viralHooks ? {
        productUrl: data.url,
        platform: 'general',
        viralHooks: true
      } : undefined
    }
  }
  
  return videoProject
}

async function sendNotification(data: any, config: any) {
  // Simulate sending notification
  console.log(`Sending notification to ${config.email}`)
  
  return {
    sent: true,
    recipient: config.email,
    subject: 'Video Generation Complete',
    timestamp: new Date()
  }
} 