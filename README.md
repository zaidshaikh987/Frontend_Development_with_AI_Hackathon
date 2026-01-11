# ArthAstra 🚀 - Smart Financial Literacy Portal with AI Guidance
*> Your Intelligent Financial Education Companion*

**SDG 8 – Decent Work & Economic Growth | Problem #19**

ArthAstra is an AI-powered financial literacy portal that empowers every Indian to master their finances. Using Google's Agent Development Kit (ADK) and multi-agent AI systems, it provides personalized financial education on credit scores, budgeting, debt management, and smart money decisions. With voice-first accessibility in Hindi/English, ArthAstra makes financial literacy accessible to all.

---

## 🎯 Problem Statement Alignment

> **SDG 8 - Problem #19**: "Smart financial literacy portal frontend with AI guidance"

| Requirement | ArthAstra Solution |
|:---|:---|
| **Smart Portal** | Modern Next.js 16 dashboard with glassmorphism UI |
| **Financial Literacy** | Credit score education, DTI/LTV explanations, budgeting guidance |
| **AI Guidance** | Multi-Agent AI (Financial Council, Recovery Squad), RAG-powered chatbot |
| **Frontend Focus** | 100% frontend-driven with React, Framer Motion animations |

---

## 🏆 Executive Summary

ArthAstra is not just an app; it is an **Intelligent Financial Education Platform**. The combination of **Voice Accessibility**, **Multi-Agent AI Guidance**, and **Interactive Learning Tools** makes financial literacy accessible to every Indian.

### 1. 📚 Financial Learning Tools
*Core features that teach users about personal finance.*

| Feature | Status | What It Teaches |
|:---|:---:|:---|
| **Credit Score Optimizer** | 🚀 Innovative | How credit scores work through "What-If" simulations. *"If I pay ₹20k debt, my score improves by 15%"* |
| **Eligibility Analyzer** | 📊 Detailed | Explains DTI (Debt-to-Income), LTV ratios, and what banks look for |
| **Multi-Goal Planner** | 🎯 Strategic | Teaches financial sequencing - when to save, borrow, or invest |
| **Peer Insights** | 👥 Gamified | "You're doing better than 78% of similar profiles" - motivates learning |

### 2. 🤖 AI-Powered Guidance System
*Multi-Agent AI that provides personalized financial education.*

| Feature | Status | How It Guides |
|:---|:---:|:---|
| **Recovery Squad** | 🩺 Educational | 3-agent pipeline that explains WHY financial issues occur and HOW to fix them |
| **Financial Council** | ⚖️ Advisory | Simulates bank committees - Optimist vs Pessimist debate teaches decision-making |
| **RAG Chatbot** | 💬 Contextual | Answers questions using RBI guidelines, tax rules - factually grounded advice |
| **Document Vision** | 👁️ Intelligent | AI explains what valid documents look like, detects common mistakes |

### 3. 🗣️ Accessibility for All Indians
*Voice-first design for inclusive financial education.*

| Feature | Status | Accessibility Impact |
|:---|:---:|:---|
| **Bilingual Voice AI** | 🎙️ Game Changer | Users learn in Hindi or English. Understands "5 Lakh" and "Pachaas Hazaar" |
| **Voice Navigation** | 🧭 Hands-Free | "Explain my credit score" navigates and teaches simultaneously |
| **Simple UI** | ✨ Intuitive | Glassmorphism design with clear visual explanations |

### 4. 📖 Interactive Learning Center 
*Structured educational content with real video lessons.*

| Feature | Status | Learning Experience |
|:---|:---:|:---|
| **Learning Modules** | 🎬 Video-based | 4 modules with 13+ lessons, embedded YouTube videos from experts (Ankur Warikoo, CA Rachana Ranade) |
| **Financial Quiz** | 🎮 Gamified | 10 interactive questions with explanations, score tracking, and achievements |
| **Progress Tracking** | 📊 Persistent | Completion badges, circular progress indicators, localStorage persistence |
| **Content Categories** | 📚 Comprehensive | Credit Scores, Budgeting (50-30-20), Loans & EMI, Investment Basics |

---

## 🧠 AI Architecture: The 4-Level Learning System

ArthAstra uses a **4-Layer Cognitive Architecture** to provide intelligent financial education.

### Level 1: Perception & Knowledge (Vision + RAG)
*The system "Sees" and "Knows".*
- **👁️ Document Vision**: Uses `gemini-2.5-flash` to analyze documents, teaching users about validity and common issues
- **📚 RAG Brain**: Uses `text-embedding-004` to retrieve knowledge from RBI guidelines, tax rules for accurate guidance

### Level 2: Analytic Reasoning (The Investigator)
*Teaches by explaining the "Why".*
- **Role**: Analyzes user's financial data
- **Teaching Method**: Explains each factor (DTI, credit history, employment stability)
- **Output**: Educational breakdown of financial health

### Level 3: Strategic Planning (The Negotiator & Architect)
*Provides actionable learning paths.*
- **The Negotiator**: Teaches how to present financial strengths
- **The Architect**: Creates personalized roadmaps: "Save ₹5k/month for 6 months → Score hits 750"

### Level 4: Adversarial Judgment (The Financial Council)
*Teaches balanced decision-making.*
- **⚡ The Optimist**: Shows potential and opportunities
- **🔒 The Pessimist**: Highlights risks to understand
- **⚖️ The Judge**: Demonstrates how balanced financial decisions are made

---

## 🔧 AI Tools Used

| Technology | Purpose |
|:---|:---|
| **Google Gemini 2.5 Flash** | Multi-agent reasoning, document vision, chat |
| **Google Text-Embedding-004** | RAG embeddings for knowledge retrieval |
| **Google Agent Development Kit (ADK)** | Multi-agent orchestration (Council, Recovery Squad) |
| **Web Speech API** | Voice recognition for accessibility |

---

## ⚡ Demo Mode vs Real AI Mode

ArthAstra includes a **DEMO_MODE** toggle for hackathon presentations and testing, significantly reducing API costs.

| Mode | Setting | Behavior |
|:---|:---:|:---|
| **Demo Mode** | `DEMO_MODE = true` | Returns pre-computed, cached AI responses instantly. Zero API calls. |
| **Real AI Mode** | `DEMO_MODE = false` | Full Gemini API integration with live multi-agent responses. |

### How to Toggle:

```typescript
// In: app/api/chat/route.ts, app/api/council-meeting/route.ts, app/api/rejection-recovery/route.ts

const DEMO_MODE = true   // For demos (no API usage)
const DEMO_MODE = false  // For real AI (requires GOOGLE_API_KEY)
```

### Benefits of Demo Mode:
- ✅ **Zero API costs** during testing and demos
- ✅ **Instant responses** - no network latency
- ✅ **Consistent results** for reproducible demos
- ✅ **Works offline** - no API key needed

### When to Use Real Mode:
- 🔥 Production deployment
- 🧪 Testing new AI features
- 📊 Evaluating actual Gemini responses

---

## 🏗️ Technical Stack

| Component | Technology |
|:---|:---|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS, Glassmorphism, Framer Motion |
| **AI Backend** | Google GenAI SDK, Vertex AI |
| **Deployment** | Google Cloud Run (Serverless) |

---

## 📂 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # AI API endpoints
│   │   ├── chat/          # RAG-powered chatbot
│   │   ├── council-meeting/   # Financial Council AI
│   │   └── rejection-recovery/ # Recovery Squad AI
│   └── dashboard/         # Learning dashboard pages
├── components/            # React UI components
│   ├── dashboard/         # Credit optimizer, eligibility, insights
│   └── landing/           # Hero section, features
├── lib/
│   ├── agents/            # Multi-agent definitions (ADK)
│   ├── ai/                # Vision, embeddings, RAG
│   ├── tools/             # Financial calculators
│   └── knowledge/         # Company knowledge base
└── docs/                  # Documentation
```

---

## 🚀 Quick Start

1. **Clone & Install**:
   ```bash
   git clone https://github.com/your-repo/arth-astra.git
   npm install
   ```

2. **Environment Setup**:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
   ```

3. **Run**:
   ```bash
   npm run dev
   ```

---

## 🌐 Live Demo

**Deployed on Netlify**: [https://arthastra.netlify.app]

---

## 📊 Evaluation Criteria Alignment

| Criteria | Weight | How ArthAstra Meets It |
|:---|:---:|:---|
| **Alignment with Track** | 25% | Direct match: AI-powered financial literacy portal with voice accessibility |
| **Innovation & Creativity** | 25% | Multi-Agent AI (Council debates), What-If credit simulator, Bilingual voice |
| **Technical Strength** | 30% | Next.js 16, Google ADK, Gemini Vision, RAG, Production-ready code |
| **Real-world Relevance** | 20% | Addresses India's financial literacy gap, Hindi/English accessibility |

---

## 👥 Team

Built with ❤️ for the **Frontend Development using AI 2026 Hackathon**

---

*Empowering every Indian to master their finances through AI-powered education.*
