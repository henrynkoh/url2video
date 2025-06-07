import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  // Real sample video URLs from Google's test videos
  const sampleVideos = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
  ]

  // Select a random video or use filename as index
  const filename = params.filename
  let videoUrl: string

  if (filename === 'sample.mp4') {
    // Use the first video for sample.mp4
    videoUrl = sampleVideos[0]
  } else {
    // Use filename hash to consistently return the same video for the same filename
    const hash = filename.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    const index = Math.abs(hash) % sampleVideos.length
    videoUrl = sampleVideos[index]
  }

  // Redirect to the actual video
  return NextResponse.redirect(videoUrl)
} 