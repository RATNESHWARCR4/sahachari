import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { adminAuth } from '@/app/lib/firebase-admin';

const MODEL_NAME = "gemini-2.5-pro";
const API_KEY = process.env.GEMINI_API_KEY;

// Function to run the chat with the Gemini model
async function runChat(prompt: string) {
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured in the environment variables.");
  }
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.7,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1024,
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

// Function to get the correct prompt template
const getPromptTemplate = (type: string, question: string, ageGroup: string, language: string) => {
    switch (type) {
        case 'analogy':
            return `Explain '${question}' to a ${ageGroup}-year-old village child in ${language} using a perfect analogy from rural Indian life (like sifting grain, drawing water from a well, cooking on a chulha, etc.). Make it so simple that any villager would understand immediately.`;
        case 'story':
            return `Create a very short story in ${language} that explains '${question}' to children aged ${ageGroup}. Use characters like farmers, animals, or village children. Keep it under 100 words with a clear explanation embedded naturally.`;
        case 'detailed':
             return `You are an expert Indian teacher explaining to rural students aged ${ageGroup} in ${language}. Provide a detailed explanation for '${question}'. Use simple words and concepts familiar to village children. Use analogies from farming, household items, animals, or nature where possible.`;
        default: // basic
            return `You are an expert Indian teacher explaining to rural students aged ${ageGroup} in ${language}. Explain '${question}' using simple words and concepts familiar to village children. Use analogies from farming, household items, animals, or nature. Give 2-3 sentences maximum. Avoid technical terms.`;
    }
}

export async function POST(request: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: 'Server Configuration Error', details: 'The Gemini API key is not set up on the server.' }, { status: 500 });
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    await adminAuth.verifyIdToken(token);
    
    const { 
      question,
      explanationType,
      ageGroup,
      language,
      subject,
    } = await request.json();

    if (!question) {
        return NextResponse.json({ error: 'Question is required.' }, { status: 400 });
    }

    const prompt = getPromptTemplate(explanationType, question, ageGroup, language);
    
    const response = await runChat(prompt);
    const answer = response.text();

    if (!answer) {
      return NextResponse.json({ error: 'Failed to generate an answer from the AI.' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, answer });
    
  } catch (error: any) {
    console.error('Gyan-Kosh API error:', error);
    return NextResponse.json({ error: 'Failed to generate answer', details: error.message }, { status: 500 });
  }
}
