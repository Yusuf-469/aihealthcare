# MedVision AI - 3D Healthcare Platform

A full-stack AI healthcare platform with React Three Fiber 3D visualizations, featuring AI-powered symptom analysis, medical report insights, and personalized care.

![MedVision AI](https://img.shields.io/badge/MedVision-AI-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Three.js](https://img.shields.io/badge/Three.js-0.158.0-green)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)

## 🚀 Features

### 3D Visualization
- **Interactive 3D Scene** - Full React Three Fiber canvas with WebGL rendering
- **DNA Helix Animations** - Rotating DNA structures with particle effects
- **Heartbeat/EKG Lines** - Animated medical heartbeat visualizations
- **Floating Medical Elements** - Pills, syringes, and crosses in 3D space
- **Particle Systems** - Ambient medical particles throughout the scene
- **GLB Model Loading** - 5 medical models with fallback geometries

### Healthcare Features
- **AI Symptom Checker** - Describe symptoms for AI-powered analysis
- **Report Analyzer** - Upload and analyze medical reports
- **Vaccination Tracker** - Never miss a vaccine
- **Medication Manager** - Track medications and drug interactions
- **Health Dashboard** - Complete health metrics overview

### UI/UX
- **Glassmorphism Design** - Modern frosted glass UI panels
- **Scroll Animations** - Smooth section transitions
- **Progress Navigation** - Dot indicators for each section
- **Responsive Design** - Works on all screen sizes

## 📁 Project Structure

```
aihealthcare/
├── client/                     # React frontend
│   ├── public/
│   │   └── models/            # GLB 3D models
│   │       ├── medical doctor 3d model.glb
│   │       ├── stethoscope 3d model.glb
│   │       ├── cartoon syringe 3d model.glb
│   │       ├── pill bottle 3d model.glb
│   │       └── dashboard.glb
│   ├── src/
│   │   ├── components/
│   │   │   ├── Scene3D.jsx    # Main 3D scene with WebGL
│   │   │   ├── LandingPage.jsx # 10-section landing page
│   │   │   ├── Dashboard.jsx   # User dashboard
│   │   │   └── tools/          # 3D tool components
│   │   ├── styles.css          # Complete styling
│   │   └── main.jsx           # Entry point
│   ├── vercel.json            # Vercel config
│   └── package.json
├── server/                    # Backend API
├── ai-service/               # AI analysis service
└── README.md
```

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Client Setup

```bash
cd client
npm install
npm run dev      # Development server on port 3000
npm run build    # Production build
npm run preview  # Preview production build
```

### Server Setup

```bash
cd server
npm install
npm run dev      # Development server on port 5000
```

## 🎮 Demo Credentials

- **Email:** demo@medvision.ai
- **Password:** demo123

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Connect to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import the repository
   - Vercel auto-detects Vite configuration
   - Deploy!

### Environment Variables

Create `.env` in client directory:
```env
VITE_API_URL=http://localhost:5000/api
```

## 🔧 Tech Stack

### Frontend
- **React 18** - UI framework
- **React Three Fiber** - 3D rendering
- **@react-three/drei** - 3D helpers
- **Three.js** - WebGL library
- **Zustand** - State management
- **GSAP** - Animations
- **Framer Motion** - UI animations

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Python/AI Service** - ML predictions

## 📱 10 Landing Page Sections

1. **Hero** - Main introduction with 3D background
2. **AI Doctor** - 24/7 AI assistant information
3. **Features** - Complete healthcare tools overview
4. **Dashboard Preview** - Health dashboard showcase
5. **Pricing** - Subscription plans
6. **Testimonials** - User reviews
7. **FAQ** - Common questions
8. **About** - Company mission and values
9. **Contact** - Contact information
10. **CTA** - Call to action

## 🔒 Security

- HIPAA compliant data handling
- End-to-end encryption
- Secure authentication
- Privacy-first design

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📧 Support

- Email: support@medvision.ai
- GitHub: https://github.com/Yusuf-469/aihealthcare

---

Built with ❤️ for better healthcare experiences
