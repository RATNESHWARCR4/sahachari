import { NextRequest, NextResponse } from 'next/server';
import { vertexAI } from '@/app/lib/google-cloud'; // Using the new centralized client
import { adminAuth } from '@/app/lib/firebase-admin';

const getWorksheetPrompt = (text: string, grades: string[], language: string) => {
  return `
    You are an expert Indian primary school teacher. Your task is to create a set of differentiated worksheets based on the following text, which is from a textbook page.
    The worksheets should be created for students in the following grades: ${grades.join(', ')}.
    The output should be in the ${language} language.

    TEXTBOOK CONTENT:
    ---
    ${text}
    ---

    INSTRUCTIONS:
    For each grade level provided, create a section with 3-4 relevant questions or activities that are appropriate for that specific grade's learning level.
    The questions should encourage critical thinking and comprehension.
    Use clear headings for each grade's section.

    Example format:
    ---
    **Grade ${grades[0]} Worksheet**
    1. [Question for Grade ${grades[0]}]
    2. [Activity for Grade ${grades[0]}]
    3. [Question for Grade ${grades[0]}]

    **Grade ${grades[1]} Worksheet**
    1. [Question for Grade ${grades[1]}]
    2. [Activity for Grade ${grades[1]}]
    ---
    
    Now, generate the worksheets based on the provided text.
  `;
};

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

    const { text, grades, language } = await request.json();

    if (!text || !grades || grades.length === 0) {
      return NextResponse.json({ error: 'Text and at least one grade are required.' }, { status: 400 });
    }

    const model = vertexAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = getWorksheetPrompt(text, grades, language);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const worksheet = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!worksheet) {
      console.error('Worksheet generation failed:', response);
      return NextResponse.json({ error: 'Failed to generate worksheet from AI response.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, worksheet });

  } catch (error: any) {
    console.error('Worksheet API Error:', error);
    return NextResponse.json({ error: 'Failed to generate worksheet', details: error.message }, { status: 500 });
  }
}
