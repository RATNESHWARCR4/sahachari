// app/api/ai/worksheet/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const magicPrompt = `
You are an expert Indian educator. Generate a well-formatted worksheet in Markdown format based on the provided image.

The worksheet must be in **[SELECTED_LANGUAGE]**.

Create the following activities based on the image content:
[GRADE_PROMPTS]

**Formatting Rules:**
- Use Markdown for all formatting.
- Use a main heading for the worksheet topic (e.g., '# Worksheet: Photosynthesis').
- Use subheadings for each grade's section (e.g., '## Grade 1: Match the Following').
- Each question and its corresponding answer option(s) must be on a new line.
- Do not include the answers in the questions. Provide a separate 'Answer Key' section at the end.
`;

async function fileToGenerativePart(file: File) {
  const base64EncodedData = await file.arrayBuffer().then(buffer => Buffer.from(buffer).toString('base64'));
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const gradePrompts = formData.get('prompt') as string;
    const language = formData.get('language') as string || 'en'; // Default to English

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const finalPrompt = magicPrompt
      .replace('[SELECTED_LANGUAGE]', language === 'en' ? 'English' : language)
      .replace('[GRADE_PROMPTS]', gradePrompts);

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    const imagePart = await fileToGenerativePart(file);

    const result = await model.generateContent([finalPrompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ worksheet: text });
  } catch (error) {
    console.error('Error generating worksheet:', error);
    return NextResponse.json({ error: 'Failed to generate worksheet' }, { status: 500 });
  }
}
