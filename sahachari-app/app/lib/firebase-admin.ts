import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccount = {
      projectId: "sahachari-933da",
      clientEmail:  "firebase-adminsdk-fbsvc@sahachari-933da.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCJax4phFzA4ytJ\nT2FUeWsADZ2srqbIU0uY0hj+T0Y1mmTdK54m0mhpWO7NZFS12xwJ0nOAFpPoyCoz\nGQfuGRpgS7QOwB6VRnY7wD9h6RkHOdxCX/Pk3Na+Wnn7yUO5rw7A0ph1mmYHxed4\ncXRgkgrHLbQ28JxJJmyCKLeXCn4AMMhKF6KhZrFR1AIJOJGDh+JMzVacmbJI0M7x\nQzVINnUbSNB6+mX90DUNRZ1ijQB3ZiTS5AUMdgYWRSex+BZfrY/BxdXsl6VfCoDQ\nyMs5DL3IzKAXSZ9Lq5ZsLuDPTzAgcZWjJ3werF/GCNilNBLArvtHV/OLOlOWh1D3\nc3QITHNFAgMBAAECggEACCEbHq+i4RJPTD3y7xFjwBQOINoQKcersDW1ns3HxIIG\nt4LOD1PhM2I8dlAaJsv4g6g8hvZO97VnsbAoZPB9O/cehsTcyk3pzq0X0s38Wg4V\nNqQAhKh/17D4iGmmpQRzJfsPY92nbYxKnjhv/wqEsrXEdH+Vb0pjnuuTuM65F3+1\nFm6matHknYr/BMvAzCHZ4Tbsct70zYLz9WKitypBNxT1teh3GJ2WV0JAwixu/Eez\nodtuHpPMy8oQ4Om0Y2Kg45k1Qoq5eaQZN2J4cQS98qPFAzOjMKdmBUUAyllHvK8s\nEeIfxxe36GHyaiiQnoyiqULbJWsQUZiG490IiJCYHQKBgQDAvEHo1aD4VXxYhzqM\n3vLpKCi4Q5lN4lLJbgV1uefoDXDCsKpjxY64NjhDOgHX8raNyMpoA+GV7H3GrOdq\nhBQOZKKK2zJOmZtNm4effJHOGramCNVyZYyetcCOAPolvLiYK01kIMuEw/1Sv2Ox\nZoABDiMXUnpWcTzHkzG+0dtAxwKBgQC2hoXWwJe8lq5jmGRClkbK2fnBBvcJk98O\nI+uIobjE09uRMxdasfiG4wfN8pWDuam4FXQCuErKH69ujrM35wWUO8k8sJikuqIv\nWKrlpUqarHQovet3bZOZT564RYMwsIWieX1ozHRu+bwaECQONmDRBv08WAjWeWyT\niNez6yi3kwKBgGi95pPChVhwHMN/ujIUd65+RKLfGdFZzePqBs2T2pQhucYUfIT8\nODOkQ69FNvtEzDEBjf45Hb98Zl4yWRFp9fxcdHlB5nUQxXXHsEzcReDcY6aX5mfl\nCCa4X4zMuyUHCsqnvcdMi037tQ/jMyqVqbrpE+j4ycNwhrdvJvms0prBAoGAMrMT\nIh/FBiFkt01xK/3KFDaP5Uol/IcSgj8AAafKRwICD0b9ybd9rRoK5O3pEfnUZsmu\nu8KtI4/BjxgcN/730cD5mN4EyFz/B9+9OKS9IFGewmJesYHCaedv0web9T5TIFpW\nt3FzNhAwa5zoJvp70hP663QYoFqCCkkMgXFkkfkCgYBkFxLLKn4CeeCzeaV6fbfr\nSh94gugdW/DrQorYwnRg+Dce0pdhrDYbK2FDml0Mns5FhaLFUMPAZas5n0pG9XD5\ny0Cd83kJCt3NShsvvI229+ucK50q1mJYOGRBr71/9GEvQbyH+XxaTvE3tmtjrVN0\nVZ1qxhzj9btzCP1Sj1DJXA==\n-----END PRIVATE KEY-----\n",
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminStorage = admin.storage();

export default admin;
