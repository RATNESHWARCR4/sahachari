// app/lib/google-cloud.ts
import { VertexAI } from '@google-cloud/vertexai';

let vertexAI: VertexAI;

try {
  const project = process.env.GOOGLE_CLOUD_PROJECT_ID;
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

  if (!project) {
    throw new Error('GOOGLE_CLOUD_PROJECT_ID environment variable is not set.');
  }

  const vertexAiOptions: {
    project: string;
    location: string;
    credentials?: { client_email: string; private_key: string };
  } = {
    project,
    location,
  };

  // This is the recommended way for services like Vercel, Cloud Run, etc.
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
    const serviceAccount = JSON.parse(
      Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64').toString('utf-8')
    );
    vertexAiOptions.credentials = {
      client_email: serviceAccount.client_email,
      private_key: serviceAccount.private_key,
    };
     console.log('Initialized Vertex AI with Base64 credentials.');
  }
  // If not using Base64, the SDK will automatically look for the 
  // GOOGLE_APPLICATION_CREDENTIALS file path or use Application Default Credentials.
  else {
    console.log('Initialized Vertex AI using Application Default Credentials.');
  }

  vertexAI = new VertexAI(vertexAiOptions);

} catch (error) {
  console.error('Failed to initialize Vertex AI:', error);
  // We don't re-throw here, so the app can start, but API calls will fail.
  // The errors will be caught in the API routes.
}

export { vertexAI };
