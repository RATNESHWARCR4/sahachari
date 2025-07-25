import { NextRequest, NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';
import { adminAuth } from '@/app/lib/firebase-admin';

// Initialize Vertex AI
const initVertexAI = () => {
  // Decode base64 service account if provided
  const serviceAccountBase64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
  
  if (serviceAccountBase64) {
    const serviceAccount = JSON.parse(
      Buffer.from(serviceAccountBase64, 'base64').toString('utf-8')
    );
    
    process.env.GOOGLE_APPLICATION_CREDENTIALS = JSON.stringify(serviceAccount);
  }
  
  return new VertexAI({
    project: process.env.GOOGLE_CLOUD_PROJECT_ID!,
    location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
  });
};

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;
    
    // Get request data
    const { prompt, language, topic, ageGroup, state } = await request.json();
    
    // Initialize Vertex AI
    const vertexAI = initVertexAI();
    const model = vertexAI.getGenerativeModel({
      model: 'gemini-pro',
    });
    
    // Create the magic prompt
    const magicPrompt = `You are an expert Indian storyteller. Your user is a teacher in a rural, multi-grade classroom in ${state || 'India'}. 
    
Generate a short, simple, and culturally relevant story in ${language} for children aged ${ageGroup}. 
The story must explain the concept of "${topic}" through local characters and situations.

Requirements:
- Use simple vocabulary and sentence structures appropriate for the age group
- Include local cultural elements, names, and situations
- The story should be easy to narrate and remember
- Include a positive moral or learning outcome
- Keep it under 500 words
- Make it engaging and interactive where possible

User's request: ${prompt}

Generate the story now:`;
    
    // Generate content
    const result = await model.generateContent(magicPrompt);
    const response = await result.response;
    const story = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!story) {
      console.error('No story content found in Vertex AI response:', response);
      return NextResponse.json(
        { error: 'Failed to extract story from AI response' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      story,
      metadata: {
        language,
        topic,
        ageGroup,
        generatedAt: new Date().toISOString(),
      },
    });
    
  } catch (error: any) {
    console.error('Story generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate story', details: error.message },
      { status: 500 }
    );
  }
} 