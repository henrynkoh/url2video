# URL2Video - AI Video Platform

A comprehensive Next.js application that combines features from 6 leading AI video platforms with hybrid workflow capabilities using APIs, n8n automation, and Model Context Protocol (MCP).

## 🚀 Features

This platform integrates the top 2 features from each of these leading AI video platforms:

### 🎭 Synthesia
- **Text-to-video with AI avatars** in 140+ languages
- **Lifelike human simulation** with natural gestures and expressions

### 📱 InVideo  
- **5,000+ templates** optimized for social media platforms
- **Text/blog to video conversion** with automated content processing

### 🎬 Pictory
- **Transform long-form content** to engaging video clips
- **AI-driven summarization** with key highlight extraction

### 🎨 Runway
- **Cinematic text-to-video generation** with professional quality
- **Motion brush and camera controls** for precise video editing

### 📝 Veed.io
- **Auto-subtitles with 98% accuracy** in 100+ languages
- **One-click translations** for global content distribution

### 🛍️ Topview.ai
- **Product URL to UGC-style videos** for e-commerce
- **Auto-generated viral script hooks** for social media engagement

## 🏗️ Architecture

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes with comprehensive project management
- **Automation**: N8N workflow integration with multiple trigger types
- **AI Integration**: Multiple AI model support via Model Context Protocol (MCP)
- **UI Components**: Custom component library with modern design

## 📁 Project Structure

```
url2video/
└── ai-video-platform/          # Main Next.js application
    ├── src/
    │   ├── app/                 # Next.js app router
    │   │   ├── api/            # API routes
    │   │   │   ├── projects/   # Project management API
    │   │   │   ├── n8n/        # N8N workflow automation
    │   │   │   └── mcp/        # Model Context Protocol integration
    │   │   ├── layout.tsx      # Root layout
    │   │   └── page.tsx        # Main application page
    │   ├── components/         # React components
    │   │   ├── ui/            # UI component library
    │   │   ├── video-creator.tsx      # Main video creation interface
    │   │   └── project-dashboard.tsx  # Project management dashboard
    │   ├── lib/               # Utility functions
    │   └── types/             # TypeScript type definitions
    ├── public/                # Static assets
    ├── tailwind.config.ts     # Tailwind CSS configuration
    └── package.json          # Dependencies and scripts
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:henrynkoh/url2video.git
   cd url2video/ai-video-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Video Creation
1. Select the **Creator** tab in the main interface
2. Choose your preferred AI platform from the available options
3. Configure settings specific to each platform
4. Generate your video content

### Project Management
1. Use the **Dashboard** tab to manage your video projects
2. Track project status and progress
3. View project statistics and analytics

### Workflow Automation
1. Access the **Workflows** tab for N8N integration
2. Set up automated content processing pipelines
3. Configure triggers and actions for your workflows

### AI Model Configuration
1. Navigate to the **Settings** tab
2. Configure MCP connections for different AI models
3. Set up API keys and model preferences

## 🔗 API Endpoints

- `POST /api/projects` - Create new video projects
- `GET /api/projects` - Retrieve project list
- `PUT /api/projects/:id` - Update project details
- `DELETE /api/projects/:id` - Delete projects
- `POST /api/n8n/workflows` - Manage N8N workflows  
- `POST /api/mcp/connections` - Configure AI model connections

## 🤖 Supported AI Models

- OpenAI GPT-4
- Anthropic Claude
- Stability AI
- Custom model integrations via MCP

## 🔧 Configuration

The application supports extensive configuration through:
- Environment variables for API keys
- MCP connections for AI model integration
- N8N workflow automation setup
- Platform-specific settings for each video generation tool

## 📋 Requirements

- Node.js 18+
- npm or yarn
- Modern web browser with JavaScript enabled

## 🚀 Deployment

The application is ready for deployment on platforms like:
- Vercel (recommended for Next.js)
- Netlify
- AWS
- Docker containers

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using Next.js, TypeScript, and the power of AI video platforms** 