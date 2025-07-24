import { NextRequest, NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';
import { adminAuth, adminStorage } from '@/app/lib/firebase-admin';

// Initialize Vertex AI
const initVertexAI = () => {
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
    const { imageUrl, grades, subject, topic } = await request.json();
    
    // Download image from Firebase Storage
    const bucket = adminStorage.bucket();
    const fileName = imageUrl.split('/').pop();
    const file = bucket.file(`textbooks/${fileName}`);
    const [imageBuffer] = await file.download();
    
    // Convert to base64
    const base64Image = imageBuffer.toString('base64');
    
    // Initialize Vertex AI
    const vertexAI = initVertexAI();
    const model = vertexAI.getGenerativeModel({
      model: 'gemini-pro-vision',
    });
    
    // Create worksheets for each grade
    const worksheets = [];
    
    for (const grade of grades) {
      const magicPrompt = `Analyze this image of a textbook page. The topic is "${topic}" for subject "${subject}".
      
Generate a differentiated worksheet for Grade ${grade} students in a multi-grade classroom in rural India.

Requirements:
- Create questions appropriate for Grade ${grade} level
- Use simple, clear language
- Include different types of questions based on grade level:
  * For grades 1-3: Matching, coloring, simple fill-in-the-blanks with word bank
  * For grades 4-5: Fill-in-the-blanks, short answer questions, simple problem solving
  * For grades 6-8: Critical thinking questions, application-based problems
- Make it suitable for copying on a blackboard (no complex diagrams)
- Include 5-7 questions
- Format the output as JSON with this structure:
{
  "title": "Worksheet title",
  "grade": ${grade},
  "questions": [
    {
      "question": "Question text",
      "type": "mcq|fillblank|shortanswer|matching",
      "options": ["option1", "option2"] (for MCQ),
      "wordBank": ["word1", "word2"] (for fill-in-the-blanks),
      "answer": "correct answer"
    }
  ]
}`;
      
      const result = await model.generateContent([
        { text: magicPrompt },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
      ]);
      
      const response = await result.response;
      const text = response.text();
      
      // Parse JSON from response
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const worksheetData = JSON.parse(jsonMatch[0]);
          worksheets.push(worksheetData);
        }
      } catch (parseError) {
        console.error('Failed to parse worksheet JSON:', parseError);
        // Fallback: return raw text
        worksheets.push({
          grade,
          title: `${topic} - Grade ${grade}`,
          rawContent: text,
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      worksheets,
      metadata: {
        grades,
        subject,
        topic,
        generatedAt: new Date().toISOString(),
      },
    });
    
  } catch (error: any) {
    console.error('Worksheet generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate worksheets', details: error.message },
      { status: 500 }
    );
  }
} 