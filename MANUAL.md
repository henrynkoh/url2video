# AI Video Platform - User Manual

## Table of Contents
1. [Getting Started](#getting-started)
2. [Platform Overview](#platform-overview)
3. [Video Creation Features](#video-creation-features)
4. [Project Management](#project-management)
5. [Workflow Automation](#workflow-automation)
6. [Settings & Configuration](#settings--configuration)
7. [API Reference](#api-reference)
8. [Troubleshooting](#troubleshooting)
9. [Advanced Features](#advanced-features)

## Getting Started

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **Node.js**: Version 18 or higher
- **RAM**: Minimum 8GB (16GB recommended)
- **Storage**: At least 2GB free space
- **Internet**: Stable broadband connection for AI processing

### Installation Process
1. **Clone Repository**
   ```bash
   git clone git@github.com:henrynkoh/url2video.git
   cd url2video/ai-video-platform
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file:
   ```
   OPENAI_API_KEY=your_openai_key
   ANTHROPIC_API_KEY=your_anthropic_key
   STABILITY_API_KEY=your_stability_key
   N8N_WEBHOOK_URL=your_n8n_webhook
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Platform Overview

### Main Interface
The AI Video Platform features a tabbed interface with four main sections:

#### 1. Creator Tab
- Primary video creation interface
- Platform-specific tools and settings
- Real-time preview capabilities
- Export and sharing options

#### 2. Dashboard Tab
- Project management overview
- Statistics and analytics
- Progress tracking
- File organization

#### 3. Workflows Tab
- N8N automation setup
- Trigger configuration
- Process monitoring
- Custom workflow creation

#### 4. Settings Tab
- API key management
- Platform preferences
- Export settings
- Account configuration

## Video Creation Features

### Synthesia Integration
**Text-to-Video with AI Avatars**
1. Navigate to Creator → Synthesia
2. Enter your script text
3. Select from 140+ languages
4. Choose AI avatar and voice
5. Customize appearance and gestures
6. Generate video (processing time: 2-5 minutes)

**Lifelike Human Simulation**
- Natural gestures and expressions
- Eye contact and head movements
- Professional presenter appearance
- Custom avatar creation available

### InVideo Features
**Template Library**
1. Browse 5,000+ templates
2. Filter by social media platform
3. Customize colors, fonts, and branding
4. Add your content and media
5. Export in platform-optimized formats

**Text/Blog to Video**
- Paste blog content or URLs
- AI extracts key points
- Automatically generates scenes
- Adds relevant stock footage
- Creates engaging transitions

### Pictory Capabilities
**Long-form Content Transformation**
1. Upload video, audio, or text content
2. AI identifies key segments
3. Creates short, engaging clips
4. Adds captions and effects
5. Optimizes for social sharing

**AI-driven Summarization**
- Intelligent content analysis
- Key highlight extraction
- Automatic scene detection
- Relevance scoring
- Custom summary length

### Runway Studio
**Cinematic Text-to-Video**
- Advanced AI video generation
- Professional quality output
- Multiple style options
- Custom prompt engineering
- High-resolution rendering

**Motion Brush & Camera Controls**
- Precise movement direction
- Camera angle adjustments
- Speed and intensity controls
- Multi-layer editing
- Professional effects library

### Veed.io Tools
**Auto-Subtitles Generation**
1. Upload your video
2. Select language (100+ options)
3. AI generates 98% accurate subtitles
4. Edit and customize appearance
5. Export with embedded captions

**One-click Translations**
- Automatic language detection
- Professional translation quality
- Cultural context awareness
- Multiple subtitle tracks
- Global reach optimization

### Topview.ai Features
**Product URL to UGC Videos**
1. Enter product URL
2. AI analyzes product details
3. Generates UGC-style content
4. Creates authentic testimonials
5. Optimizes for conversion

**Viral Script Generation**
- Hook creation algorithms
- Trend analysis integration
- Engagement optimization
- A/B testing suggestions
- Platform-specific adaptations

## Project Management

### Creating Projects
1. Click "New Project" in Dashboard
2. Select primary platform
3. Choose project template
4. Set project parameters:
   - Name and description
   - Target audience
   - Output format
   - Quality settings

### Project Organization
- **Folders**: Organize by client, campaign, or platform
- **Tags**: Add searchable metadata
- **Status Tracking**: Draft, In Progress, Review, Complete
- **Collaboration**: Share with team members

### Version Control
- Automatic save every 30 seconds
- Manual checkpoint creation
- Version comparison tools
- Rollback capabilities
- Export version history

## Workflow Automation

### N8N Integration Setup
1. Install N8N locally or use cloud version
2. Create webhook endpoints
3. Configure trigger conditions
4. Set up processing chains
5. Connect to external services

### Common Workflow Examples

**Content Processing Pipeline**
- RSS feed monitoring
- Automatic content extraction
- AI video generation
- Social media publishing
- Performance tracking

**Batch Video Creation**
- CSV data import
- Template application
- Bulk processing
- Quality validation
- Organized export

### Trigger Types
- **Time-based**: Scheduled processing
- **Webhook**: External API calls
- **File Upload**: New content detection
- **Email**: Content submission via email
- **Database**: Data change monitoring

## Settings & Configuration

### API Key Management
Navigate to Settings → API Keys to configure:

**OpenAI Integration**
- GPT-4 for script generation
- DALL-E for image creation
- Whisper for audio transcription

**Anthropic Claude**
- Advanced text processing
- Content analysis
- Creative writing assistance

**Stability AI**
- Image generation
- Style transfer
- Background creation

### Export Settings
**Video Quality Options**
- 4K Ultra HD (3840×2160)
- Full HD (1920×1080)
- HD (1280×720)
- Social Media optimized

**Format Support**
- MP4 (recommended)
- MOV (Apple devices)
- AVI (Windows compatibility)
- WebM (web optimization)

### Platform Preferences
- Default templates
- Brand color schemes
- Font selections
- Logo placements
- Watermark settings

## API Reference

### Projects API
```javascript
// Create new project
POST /api/projects
{
  "name": "Video Title",
  "platform": "synthesia",
  "settings": {...}
}

// Get project list
GET /api/projects

// Update project
PUT /api/projects/:id
{
  "status": "completed",
  "settings": {...}
}

// Delete project
DELETE /api/projects/:id
```

### N8N Workflows API
```javascript
// Create workflow
POST /api/n8n/workflows
{
  "name": "Content Pipeline",
  "triggers": [...],
  "actions": [...]
}

// Execute workflow
POST /api/n8n/execute/:workflowId
{
  "data": {...}
}
```

### MCP Connections API
```javascript
// Configure AI model
POST /api/mcp/connections
{
  "provider": "openai",
  "model": "gpt-4",
  "apiKey": "...",
  "settings": {...}
}
```

## Troubleshooting

### Common Issues

**Video Generation Fails**
- Check API key validity
- Verify internet connection
- Ensure sufficient credits/quota
- Review input content for policy violations

**Slow Processing**
- Check system resources
- Close unnecessary applications
- Upgrade hardware if needed
- Consider cloud processing options

**Export Errors**
- Verify export format compatibility
- Check available disk space
- Ensure write permissions
- Try different quality settings

### Error Codes
- **ERR_001**: Invalid API key
- **ERR_002**: Insufficient credits
- **ERR_003**: Content policy violation
- **ERR_004**: File format not supported
- **ERR_005**: Network connection timeout

### Getting Help
- GitHub Issues: Report bugs and feature requests
- Documentation: Comprehensive guides and tutorials
- Community Forum: User discussions and tips
- Email Support: Direct technical assistance

## Advanced Features

### Custom AI Model Integration
Create custom MCP connections for specialized AI models:

```javascript
const customModel = {
  provider: "custom",
  endpoint: "https://your-ai-api.com",
  authentication: "bearer_token",
  capabilities: ["text-generation", "image-analysis"]
};
```

### Batch Processing
Process multiple videos simultaneously:
1. Prepare CSV with video parameters
2. Upload to batch processor
3. Monitor progress in Dashboard
4. Download completed videos in bulk

### Advanced Scripting
Create custom automation scripts:
```javascript
// Custom video processing function
async function processVideo(videoData) {
  const script = await generateScript(videoData.content);
  const video = await createVideo(script, videoData.settings);
  return await exportVideo(video, videoData.format);
}
```

### Integration Examples
- **Zapier**: Connect to 5,000+ apps
- **IFTTT**: Create simple automations
- **Slack**: Team notifications
- **Discord**: Community updates
- **Google Sheets**: Data management

---

*For additional support or feature requests, please visit our GitHub repository or contact support at support@url2video.com* 