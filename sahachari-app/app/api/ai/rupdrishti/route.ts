import { NextRequest, NextResponse } from 'next/server';
import { vertexAI } from '@/app/lib/google-cloud'; // Using the new centralized client
import { adminAuth } from '@/app/lib/firebase-admin';

const getPromptTemplate = (style: string, topic: string) => {
    if (style === 'grid') {
        return `Generate a simple, structured diagram for the concept of '${topic}' using only basic ASCII characters (like |, -, +, *, #, >). The output must be plain text, suitable for a teacher to easily copy onto a gridded blackboard. Do not include any narrative or descriptive text outside of the diagram itself.`;
    }
    
    // Default to blackboard style
    return `Generate a very simple, bold, black-and-white line drawing of '${topic}'. The style must be extremely minimalist, suitable for a person to easily replicate by hand on a blackboard using chalk. Use only essential, thick lines and avoid all shading, complex textures, and fine details. Add clear, simple, uppercase labels for each key element. The final output should be a clean, high-contrast image.`;
}

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

        const { prompt: topic, style } = await request.json();

        if (!topic) {
            return NextResponse.json({ error: 'A topic/prompt is required.' }, { status: 400 });
        }

        const model = vertexAI.getGenerativeModel({ model: 'imagen-3.0' });

        const magicPrompt = getPromptTemplate(style, topic);

        const response = await model.generateContent(magicPrompt);

        const imageUrl = response?.response?.candidates?.[0]?.content?.parts?.[0]?.fileData?.fileUri;

        if (!imageUrl) {
            const textDiagram = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (style === 'grid' && textDiagram) {
                 return NextResponse.json({ success: true, isText: true, content: textDiagram });
            }
            console.error('Image generation failed, no URL found in response:', response);
            return NextResponse.json({ error: 'Failed to generate visual aid from AI response.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, isText: false, content: imageUrl });

    } catch (error: any) {
        console.error('Rupdrishti API Error:', error);
        return NextResponse.json({ error: 'Failed to generate visual aid', details: error.message }, { status: 500 });
    }
}
