#!/bin/bash

echo "🎓 Welcome to Sahachari Setup!"
echo "=============================="
echo ""

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18+ is required. Current version: $(node -v)"
    echo "Please install Node.js 18 or higher from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "📦 Installing Firebase CLI..."
    npm install -g firebase-tools
fi

echo "✅ Firebase CLI installed"
echo ""

# Create env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp env.example .env.local
    echo "✅ Created .env.local - Please update it with your Firebase and Google Cloud credentials"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Firebase and Google Cloud credentials"
echo "2. Run 'firebase login' to authenticate with Firebase"
echo "3. Run 'firebase init' to connect to your Firebase project"
echo "4. Run 'npm run dev' to start the development server"
echo ""
echo "For demo mode (without Google Cloud):"
echo "- The app will work with demo data"
echo "- You can test all features with sample content"
echo ""
echo "Happy coding! 🚀" 