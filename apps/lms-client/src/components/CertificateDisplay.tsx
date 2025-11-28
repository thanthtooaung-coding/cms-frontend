import { useEffect, useState } from 'react';
import { Card, CardContent } from '@cms/ui/components/card';
import { Button } from '@cms/ui/components/button';
import { Award, Download, Share2 } from 'lucide-react';
import { lmsApiFetch } from '../utils/apiClient';
import { useAuthDataStore } from '../store/auth-store';

interface CertificateDisplayProps {
  courseId: number;
  studentId: number;
}

interface CertificateData {
  id: number;
  studentId: number;
  studentName: string;
  courseId: number;
  courseTitle: string;
  certificateNumber: string;
  issuedDate: string;
  scorePercentage: number;
}

const CertificateDisplay = ({ courseId, studentId }: CertificateDisplayProps) => {
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        const response = await lmsApiFetch(`/certificates/student/${studentId}/course/${courseId}`, {
          method: 'GET',
        }, false);

        if (response.status === 404) {
          setCertificate(null);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch certificate');
        }

        const data = await response.json();
        setCertificate(data);
      } catch (err) {
        console.error('Error fetching certificate:', err);
        setError('Failed to load certificate');
      } finally {
        setLoading(false);
      }
    };

    if (studentId && courseId) {
      fetchCertificate();
    }
  }, [studentId, courseId]);

  const handleDownload = () => {
    // Create a printable version of the certificate
    const printWindow = window.open('', '_blank');
    if (printWindow && certificate) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Certificate - ${certificate.courseTitle}</title>
            <style>
              @media print {
                body { margin: 0; }
              }
              body {
                font-family: 'Georgia', serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 20px;
              }
              .certificate {
                background: white;
                padding: 60px;
                max-width: 800px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                border: 20px solid #f4d03f;
                text-align: center;
              }
              .header {
                border-bottom: 3px solid #667eea;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .header h1 {
                color: #667eea;
                font-size: 48px;
                margin: 0;
                font-weight: bold;
                letter-spacing: 3px;
              }
              .content {
                margin: 40px 0;
              }
              .content p {
                font-size: 20px;
                line-height: 1.8;
                color: #333;
                margin: 15px 0;
              }
              .student-name {
                font-size: 36px;
                font-weight: bold;
                color: #667eea;
                margin: 20px 0;
                text-decoration: underline;
              }
              .course-name {
                font-size: 28px;
                color: #764ba2;
                font-weight: bold;
                margin: 20px 0;
              }
              .score {
                font-size: 24px;
                color: #27ae60;
                font-weight: bold;
                margin: 20px 0;
              }
              .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid #ddd;
                font-size: 14px;
                color: #666;
              }
              .cert-number {
                font-size: 12px;
                color: #999;
                margin-top: 10px;
              }
            </style>
          </head>
          <body>
            <div class="certificate">
              <div class="header">
                <h1>🎓 CERTIFICATE OF COMPLETION</h1>
              </div>
              <div class="content">
                <p>This is to certify that</p>
                <div class="student-name">${certificate.studentName}</div>
                <p>has successfully completed the course</p>
                <div class="course-name">${certificate.courseTitle}</div>
                <div class="score">with a score of ${certificate.scorePercentage}%</div>
                <p>on ${new Date(certificate.issuedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div class="footer">
                <p>Certificate Number: ${certificate.certificateNumber}</p>
                <div class="cert-number">This certificate is issued digitally and can be verified through the learning management system.</div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  if (loading) {
    return null;
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
        <CardContent className="p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!certificate) {
    return null;
  }

  return (
    <Card className="border-4 border-yellow-400 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 shadow-2xl">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Award className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-purple-700 dark:text-purple-300">
              🎓 Certificate of Completion
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded"></div>
          </div>

          <div className="space-y-4 py-6">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              This is to certify that
            </p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 underline decoration-2">
              {certificate.studentName}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              has successfully completed the course
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {certificate.courseTitle}
            </p>
            <div className="pt-4">
              <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                with a score of {certificate.scorePercentage}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Issued on {new Date(certificate.issuedDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-300 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Certificate Number: {certificate.certificateNumber}
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleDownload}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `Certificate: ${certificate.courseTitle}`,
                      text: `I completed ${certificate.courseTitle} with ${certificate.scorePercentage}%!`,
                    });
                  }
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificateDisplay;

