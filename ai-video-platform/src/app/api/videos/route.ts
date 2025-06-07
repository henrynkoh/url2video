import { NextRequest, NextResponse } from 'next/server'

// This would typically be connected to a database
// For now, we'll simulate with in-memory storage that matches our video generation system
// Using real sample videos for demonstration
const sampleVideos = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
]

const mockCompletedVideos = [
  {
    id: 'video_1749248861397_72r5qhwa8',
    title: 'Professional Product Showcase',
    description: 'AI-generated video from URL analysis featuring product highlights and benefits',
    duration: '1:12 mins long',
    progress: 100,
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    sourceUrl: 'https://www.coupang.com/vp/products/6850280030?vendorItemId=86297597740',
    thumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=320&h=180&fit=crop',
    views: 247,
    videoUrl: sampleVideos[0] // Real working video
  },
  {
    id: 'video_1749249364353_7xt69689y',
    title: 'E-commerce Product Demo',
    description: 'AI-generated promotional video with engaging script and professional presentation',
    duration: '1:18 mins long', 
    progress: 100,
    status: 'completed',
    createdAt: '2024-01-15T10:45:00Z',
    sourceUrl: 'https://www.coupang.com/vp/products/6850280030?vendorItemId=86297597740',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=320&h=180&fit=crop',
    views: 183,
    videoUrl: sampleVideos[1] // Real working video
  }
]

export async function GET(request: NextRequest) {
  try {
    console.log('📹 Fetching completed videos...')
    
    const url = new URL(request.url)
    const videoId = url.searchParams.get('id')
    
    if (videoId) {
      // Return specific video
      const video = mockCompletedVideos.find(v => v.id === videoId)
      if (!video) {
        return NextResponse.json({ error: 'Video not found' }, { status: 404 })
      }
      console.log(`📹 Found video: ${video.title}`)
      return NextResponse.json({ video })
    }
    
    // Return all completed videos
    console.log(`📹 Returning ${mockCompletedVideos.length} completed videos`)
    return NextResponse.json({ videos: mockCompletedVideos })
    
  } catch (error) {
    console.error('❌ Error fetching videos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
} 