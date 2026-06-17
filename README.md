<div align="center">
<img width="1200" height="475" alt="Vessel-Nexus Banner" src="https://img.shields.io/badge/Vessel--Nexus-AI%20Studio%20App-blue?style=for-the-badge" />
</div>

# Vessel-Nexus

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![AI Studio](https://img.shields.io/badge/Built%20with-Google%20AI%20Studio-red?style=flat-square)](https://ai.studio)

> A modern AI-powered application built with Google's Gemini API and AI Studio. Deploy locally or to the cloud with ease.

## Overview

Vessel-Nexus is an AI Studio application that leverages Google's Gemini API to deliver intelligent, real-time responses. This repository contains everything you need to run, develop, and deploy your AI-powered application locally or in production environments.

**View your app in AI Studio:** [https://ai.studio/apps/bd7460bb-0291-4696-ad5a-0f98cef1ecd3](https://ai.studio/apps/bd7460bb-0291-4696-ad5a-0f98cef1ecd3)

## 📋 Features

- 🤖 **AI-Powered Responses** - Powered by Google's Gemini API
- ⚡ **Fast & Responsive** - Built with modern web technologies
- 🔧 **Easy Setup** - Simple configuration and local development
- 📦 **Production Ready** - Deploy to cloud platforms with confidence
- 🎨 **Customizable** - Extend and modify for your use case

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18 or higher ([download](https://nodejs.org/))
- **npm** (comes with Node.js)
- A **Gemini API Key** ([get one here](https://ai.google.dev/))

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/molleradrian/Vessel-Nexus.git
   cd Vessel-Nexus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure your API Key**
   - Open or create the `.env.local` file in the project root
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```
   - **⚠️ Never commit `.env.local` to version control**

4. **Run the development server**
   ```bash
   npm run dev
   ```
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - The app will automatically reload as you make changes

## 📖 Usage

Once the development server is running:

1. Navigate to the local app URL (typically `http://localhost:3000`)
2. Interact with the AI features powered by Gemini
3. Make changes to the code and see them reflected in real-time

## 🛠️ Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm start` - Run the production build
- `npm test` - Run tests (if configured)

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com) and import this repository
3. Add your `GEMINI_API_KEY` to environment variables
4. Deploy with one click

### Deploy to Other Platforms

- **Google Cloud Run** - Container-based deployment
- **Heroku** - Traditional platform as a service
- **AWS Lambda** - Serverless option

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md) (if available).

## 🤝 Contributing

Contributions are welcome! Here's how to help:

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Commit your changes**: `git commit -m 'Add your feature'`
4. **Push to the branch**: `git push origin feature/your-feature`
5. **Submit a Pull Request**

Please ensure:
- Code follows the project's style guidelines
- Changes are well-documented
- Tests pass (if applicable)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Resources

- [Google Gemini API Docs](https://ai.google.dev/)
- [AI Studio](https://ai.studio/)
- [Node.js Documentation](https://nodejs.org/docs/)

## 📧 Support

For issues, questions, or suggestions:
- Open an [Issue](https://github.com/molleradrian/Vessel-Nexus/issues)
- Check [Discussions](https://github.com/molleradrian/Vessel-Nexus/discussions)

---

<div align="center">

**Built with ❤️ by [molleradrian](https://github.com/molleradrian)**

</div>
