import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { adminAuth } from '@/app/lib/firebase-admin';

const MODEL_NAME = "gemini-2.5-pro"; // Updated model name
const API_KEY = process.env.GEMINI_API_KEY!;

async function runChat(prompt: string) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ];

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig,
    safetySettings,
  });

  return result.response;
}


export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    await adminAuth.verifyIdToken(token);
    
    const { 
      language, 
      topic, 
      ageGroup, 
      storyType, 
      storyLength, 
      subject, 
      state 
    } = await request.json();
    
    // Convert storyLength to a duration in minutes for the prompt
    const durationMap: { [key: string]: string } = {
      'short': '2-3',
      'medium': '5-7',
      'long': '10-12'
    };
    const duration = durationMap[storyLength] || '5-7';

    // The new "Magic Prompt"
    const magicPrompt = `
      You are an expert Indian storyteller and educator. Your task is to generate a culturally relevant ${storyType} in the ${language} language for rural children in the state of ${state}, India, who are in the ${ageGroup} age group.

      The content must explain the educational concept of "${topic}" which falls under the subject of ${subject}. The explanation should be woven into the narrative using local farmer characters and simple, everyday situations.

      Key Requirements:
      - Language and Vocabulary: Use simple vocabulary and sentence structures appropriate for the specified age group. Where appropriate, you may include common local dialect words from ${state}, but ensure they are understandable in the broader context.
      - Cultural and Regional Context: The story must be deeply rooted in the culture of ${state}. Mention local customs, festivals, or seasonal elements if relevant to the topic. Use common names for characters that would be familiar in the region.
      - Narrative Structure: The ${storyType} should have a clear beginning, a middle where the educational concept is explained through the plot, and an end with a positive moral or practical learning outcome.
      - Tone and Style: The tone should be engaging, conversational, and easy for a teacher to narrate.
      - Length: The content should be long enough to be narrated in approximately ${duration} minutes.

      Generate the ${storyType} now.
    `;
    
    const response = await runChat(magicPrompt);
    const story = response.text();

    if (!story) {
      console.error('No story content found in Gemini Pro response:', response);
      return NextResponse.json({ error: 'Failed to extract story from AI response' }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      story,
      metadata: { language, topic, ageGroup, storyType, storyLength, subject, state, generatedAt: new Date().toISOString() },
    });
    
  } catch (error: any) {
    console.error('Story generation error:', error);
    if (error.message.includes('API_KEY_INVALID')) {
        return NextResponse.json({ error: 'Invalid API Key for Gemini', details: 'The provided API key is invalid or not configured.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to generate story', details: error.message }, { status: 500 });
  }
}
