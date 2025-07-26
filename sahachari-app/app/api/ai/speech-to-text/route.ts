import { NextRequest, NextResponse } from 'next/server';
import { vertexAI } from '@/app/lib/google-cloud'; // Using the new centralized client
import { adminAuth } from '@/app/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    if (!vertexAI) {
      throw new Error('Vertex AI client is not initialized. Check server logs for initialization errors.');
    }

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

    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    const audioBase64 = audioBuffer.toString('base64');
    
    // Using a model that is optimized for transcription
    const model = vertexAI.getGenerativeModel({
      model: 'gemini-1.5-flash', 
    });

    const transcriptionPrompt = `Transcribe the following audio. Only return the transcribed text.`;
    
    const parts = [
      { text: transcriptionPrompt },
      {
        inlineData: {
          mimeType: audioFile.type || 'audio/webm',
          data: audioBase64,
        },
      },
    ];

    const result = await model.generateContent({ contents: [{ role: 'user', parts }] });
    const response = await result.response;
    const transcription = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (transcription === undefined) {
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
