import { NextRequest, NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';
import { adminAuth } from '@/app/lib/firebase-admin';

// Initialize Vertex AI
const initVertexAI = () => {
  const serviceAccountBase64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
  let credentials = {};

  if (serviceAccountBase64) {
    try {
      const serviceAccount = JSON.parse(
        Buffer.from(serviceAccountBase64, 'base64').toString('utf-8')
      );

      // Temporary: Log the decoded service account to the console.
      console.log('Decoded Service Account:', serviceAccount);

      credentials = {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key,
      };
    } catch (error) {
      console.error("Error parsing service account credentials from base64:", error);
      // Fallback or throw error as appropriate
    }
  }

  return new VertexAI({
    project: process.env.GOOGLE_CLOUD_PROJECT_ID!,
    location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
    credentials,
  });
};

export async function POST(request: NextRequest) {
  try {
    // Verify authentication (optional, but good practice)
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    await adminAuth.verifyIdToken(token);

    const formData = await request.formData();
    const audioFile = formData.get('audio') as Blob | null;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Convert blob to base64 for Vertex AI
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    const audioBase64 = audioBuffer.toString('base64');

    // Initialize Vertex AI
    const vertexAI = initVertexAI();
    
    const model = vertexAI.getGenerativeModel({
      model: 'gemini-pro',
    });

    const transcriptionPrompt = `Transcribe the following audio. Only return the transcribed text, nothing else.`;
    
    const parts = [
      { text: transcriptionPrompt },
      {
        inlineData: {
          mimeType: audioFile.type || 'audio/webm', // Ensure correct MIME type
          data: audioBase64,
        },
      },
    ];

    const result = await model.generateContent({ contents: [{ role: 'user', parts }] });
    const response = await result.response;
    const transcription = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!transcription) {
      console.error('No transcription content found in Vertex AI response:', response);
      return NextResponse.json(
        { error: 'Failed to transcribe audio from AI response' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      transcription,
    });
  } catch (error: any) {
    console.error('Speech-to-text error:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio', details: error.message },
      { status: 500 }
    );
  }
}
