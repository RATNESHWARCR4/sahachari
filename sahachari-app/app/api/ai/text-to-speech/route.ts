import { NextRequest, NextResponse } from 'next/server';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { adminAuth } from '@/app/lib/firebase-admin';

// This function initializes the Text-to-Speech client.
// It automatically uses the service account credentials set up for your project.
const getClient = () => {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
    throw new Error('Google Cloud credentials are not set. Please configure GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_APPLICATION_CREDENTIALS_BASE64.');
  }
  return new TextToSpeechClient();
};

export async function POST(request: NextRequest) {
  try {
    // 1. Verify user authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    await adminAuth.verifyIdToken(token);

    // 2. Get the text and language from the request
    const { text, languageCode = 'en-IN' } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required for speech synthesis.' }, { status: 400 });
    }

    // 3. Select a high-quality voice based on the language
    // These are modern, natural-sounding voices.
    const voiceMap: { [key: string]: { name: string; ssmlGender: 'FEMALE' | 'MALE' } } = {
      'en-IN': { name: 'en-IN-Wavenet-D', ssmlGender: 'FEMALE' }, // English (India)
      'hi-IN': { name: 'hi-IN-Wavenet-D', ssmlGender: 'FEMALE' }, // Hindi (India)
      'kn-IN': { name: 'kn-IN-Wavenet-A', ssmlGender: 'FEMALE' }, // Kannada (India)
      'mr-IN': { name: 'mr-IN-Wavenet-A', ssmlGender: 'FEMALE' }, // Marathi (India)
    };
    
    const selectedVoice = voiceMap[languageCode] || voiceMap['en-IN'];

    // 4. Construct the request for the Text-to-Speech API
    const synthesisRequest = {
      input: { text },
      voice: {
        languageCode: languageCode,
        name: selectedVoice.name,
        ssmlGender: selectedVoice.ssmlGender,
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1,
      },
    };

    // 5. Call the API and return the audio
    const textToSpeechClient = getClient();
    const [response] = await textToSpeechClient.synthesizeSpeech(synthesisRequest as any);
    
    if (!response.audioContent) {
      return NextResponse.json({ error: 'Failed to generate audio content.' }, { status: 500 });
    }

    return new NextResponse(response.audioContent, {
      status: 200,
      headers: { 'Content-Type': 'audio/mpeg' },
    });

  } catch (error: any) {
    console.error('Text-to-Speech error:', error);
    if (error.message.includes('PERMISSION_DENIED') || error.message.includes('SERVICE_DISABLED')) {
        return NextResponse.json({
            error: 'API Permission Error',
            details: 'The Cloud Text-to-Speech API is not enabled for your project. Please enable it in the Google Cloud Console.',
            fix_url: `https://console.developers.google.com/apis/api/texttospeech.googleapis.com/overview?project=${process.env.GOOGLE_CLOUD_PROJECT_ID}`
        }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to generate speech', details: error.message }, { status: 500 });
  }
}
