#!/bin/bash

echo "🚀 Deploying to Vercel..."

# Build the project
echo "📦 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Vercel
    echo "🌐 Deploying to Vercel..."
    npx vercel --prod
    
    echo "🎉 Deployment complete!"
    echo "Your app should now be available at: https://dhikcar.vercel.app"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
