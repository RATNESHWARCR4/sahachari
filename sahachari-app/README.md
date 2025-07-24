# Sahachari - AI Teaching Companion 🎓

Sahachari (सहचारी) is an AI-powered teaching assistant designed to empower teachers in multi-grade, low-resource classrooms across India. Built with Next.js, Firebase, and Google Cloud AI services.

## 🌟 Features

### Core Features
- **📚 Kahani-Kār (Story Maker)**: Generate culturally relevant stories in local languages
- **📝 Path-Prakriya (Worksheet Creator)**: Create differentiated worksheets for multiple grades
- **🧠 Gyan-Kosh (Knowledge Base)**: Instant answers to student questions with local analogies
- **🎨 Rupdrishti (Visual Aids)**: Generate simple diagrams for blackboard teaching
- **🎤 Vachan-Guru (Reading Assessment)**: Audio-based reading fluency assessment
- **🎮 Khel-Khel Mein (Game Generator)**: Create educational games without materials
- **📅 Path-Yojak (Lesson Planner)**: AI-powered weekly lesson planning
- **👥 Sahachari Mandal (Teacher Circles)**: Collaborative community for teachers

### Technical Features
- 🌍 Multi-language support (English, Hindi, Kannada, Marathi)
- 📱 Progressive Web App (PWA) - works offline
- 🔐 Secure authentication (Email, Google, Phone)
- ☁️ Cloud-based storage and sync
- 🚀 Optimized for low-bandwidth environments

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage, Functions)
- **AI Services**: Google Vertex AI (Gemini Pro, Speech-to-Text, Text-to-Speech, Imagen)
- **Deployment**: Firebase Hosting, Firebase Studio

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)
- Google Cloud Platform account
- Firebase project

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
cd sahachari-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Setup

#### Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication (Email/Password, Google, Phone)
4. Create a Firestore database
5. Enable Storage
6. Enable Functions

#### Get Firebase Configuration
1. In Firebase Console, go to Project Settings
2. Add a web app
3. Copy the configuration values

### 4. Google Cloud Setup

#### Enable APIs
In Google Cloud Console, enable:
- Vertex AI API
- Cloud Speech-to-Text API
- Cloud Text-to-Speech API
- Cloud Translation API

#### Create Service Account
1. Go to IAM & Admin > Service Accounts
2. Create a new service account
3. Grant roles:
   - Vertex AI User
   - Cloud Speech-to-Text User
   - Cloud Text-to-Speech User
4. Download the JSON key file

### 5. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin SDK
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=your-service-account-email
FIREBASE_ADMIN_PRIVATE_KEY="your-private-key"

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your-gcp-project-id
GOOGLE_CLOUD_LOCATION=us-central1

# Google Cloud Service Account (Base64 encoded)
GOOGLE_APPLICATION_CREDENTIALS_BASE64=your-base64-encoded-service-account-key
```

To encode your service account key:
```bash
base64 -i path-to-your-service-account-key.json | tr -d '\n'
```

### 6. Firebase Initialization

```bash
firebase login
firebase init
```

Select:
- Firestore
- Functions
- Hosting
- Storage
- Emulators

### 7. Deploy Firebase Rules and Indexes

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage:rules
```

## 🏃‍♂️ Running Locally

### Development Mode
```bash
npm run dev
```

### With Firebase Emulators
```bash
# In one terminal
firebase emulators:start

# In another terminal
npm run dev
```

Visit http://localhost:3000

## 📱 PWA Installation

1. Open the app in Chrome/Edge on mobile
2. You'll see an "Install" prompt
3. Accept to install as a PWA

## 🚀 Deployment

### Deploy to Firebase Hosting

1. Build the application:
```bash
npm run build
```

2. Deploy:
```bash
firebase deploy
```

### Deploy with Firebase Studio (Special Prize Eligible!)

1. Install Firebase Studio extension
2. Connect your Firebase project
3. Use the Studio UI to deploy

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test with Emulators
```bash
firebase emulators:exec --only firestore,auth,storage "npm test"
```

## 📁 Project Structure

```
sahachari-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── components/        # Reusable components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and configurations
│   ├── store/            # Zustand state management
│   ├── types/            # TypeScript types
│   └── [features]/       # Feature pages
├── public/                # Static assets
├── styles/               # Global styles
├── functions/            # Firebase functions
└── firebase files        # Firebase configuration

```

## 🔐 Security Considerations

- All API keys should be kept in environment variables
- Firebase Security Rules are configured to protect user data
- Service account keys should never be committed to the repository
- Use Firebase App Check for additional security in production

## 🌍 Localization

The app supports multiple languages. To add a new language:

1. Add translations in `app/lib/translations.ts`
2. Add the language option in language selectors
3. Test all features in the new language

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is built for the Google Hackathon and follows the competition guidelines.

## 🙏 Acknowledgments

- Google Cloud Platform for AI services
- Firebase for backend infrastructure
- The teaching community in rural India for inspiration

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Contact the development team

---

**Built with ❤️ for teachers in multi-grade classrooms**

**Sahachari - सहचारी - ಸಹಚಾರಿ - सहचारी**

*Your AI companion in the teaching journey* 