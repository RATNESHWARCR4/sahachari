// app/worksheet-creator/page.tsx
'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { useStore } from '@/app/store';
import { t } from '@/app/lib/translations';
import { Upload, Settings, Wand2, Loader2, Share2, Download, Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ReactMarkdown from 'react-markdown';

export default function WorksheetCreatorPage() {
  const { user } = useAuth();
  const { language } = useStore();

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [worksheet, setWorksheet] = useState<string | null>(null);
  const [selectedGrades, setSelectedGrades] = useState<number[]>([1]);
  const worksheetRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUploadedFile(event.target.files[0]);
    }
  };

  const handleGradeChange = (grade: number) => {
    setSelectedGrades(prev => 
      prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]
    );
  };

  const handleGenerate = async () => {
    if (!uploadedFile) return;

    setIsGenerating(true);
    setWorksheet(null);

    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('language', language);

    const gradePrompts = selectedGrades.map(grade => {
      if (grade === 1) return "a match the following activity";
      if (grade === 2) return "a fill-in-the-blanks activity";
      if (grade === 3) return "a multiple-choice question activity";
      return "a short answer question activity";
    }).join(", ");

    const prompt = `Generate worksheets for grades ${selectedGrades.join(", ")} with the following activities: ${gradePrompts}.`;
    formData.append('prompt', prompt);

    try {
      const response = await fetch('/api/ai/worksheet', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setWorksheet(data.worksheet);
      } else {
        console.error('Failed to generate worksheet');
      }
    } catch (error) {
      console.error('Error generating worksheet:', error);
    }

    setIsGenerating(false);
  };

  const handleDownloadPdf = () => {
    if (worksheetRef.current) {
      html2canvas(worksheetRef.current).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('worksheet.pdf');
      });
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 lang-${language}`}>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary-600">
              {t(language, 'features.worksheetCreator.title')}
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              {t(language, 'features.worksheetCreator.description')}
            </p>
          </div>
          <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
            <ArrowLeft size={20} />
            <span>{t(language, 'common.backToHome')}</span>
          </Link>
        </header>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Upload className="mr-2" /> {t(language, 'worksheetCreator.uploadContent')}
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input type="file" onChange={handleFileChange} className="mb-4" />
              {uploadedFile && <p>Selected file: {uploadedFile.name}</p>}
              <p className="text-gray-500">{t(language, 'worksheetCreator.dragAndDrop')}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Settings className="mr-2" /> {t(language, 'worksheetCreator.selectGrades')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map(grade => (
                <button
                  key={grade}
                  onClick={() => handleGradeChange(grade)}
                  className={`px-4 py-2 rounded-md ${selectedGrades.includes(grade) ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
                >
                  Grade {grade}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleGenerate}
              disabled={!uploadedFile || isGenerating}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  {t(language, 'worksheetCreator.generating')}
                </>
              ) : (
                <>
                  <Wand2 className="mr-2" />
                  {t(language, 'worksheetCreator.generate')}
                </>
              )}
            </button>
          </div>

          {worksheet && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div ref={worksheetRef} className="prose max-w-none p-4 border rounded-md">
                <ReactMarkdown>{worksheet}</ReactMarkdown>
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button onClick={handleDownloadPdf} className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                  <Download size={20} />
                  <span>{t(language, 'common.downloadPdf')}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                  <Printer size={20} />
                  <span>{t(language, 'common.print')}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                  <Share2 size={20} />
                  <span>{t(language, 'common.share')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
