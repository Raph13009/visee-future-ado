import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { generateProfessionalPDF } from "@/lib/report/professionalPDF";

const PersonalityPaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationMessage, setGenerationMessage] = useState("Preparing...");
  const [error, setError] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  useEffect(() => {
    // Auto-generate PDF when page loads
    const generatePDF = async () => {
      try {
        const encodedAnswers = searchParams.get('answers');
        if (!encodedAnswers) {
          setError("Missing answers data. Please complete the test again.");
          return;
        }

        // Decode answers
        let answers;
        try {
          const decoded = atob(encodedAnswers);
          answers = JSON.parse(decoded);
        } catch (e) {
          setError("Invalid answers data. Please complete the test again.");
          return;
        }

        setIsGenerating(true);
        setGenerationProgress(10);
        setGenerationMessage("Calculating your personality scores...");

        // Generate PDF with progress callback
        const pdf = await generateProfessionalPDF(answers, (progress, message) => {
          setGenerationProgress(progress);
          setGenerationMessage(message);
        });
        
        setGenerationProgress(100);
        setGenerationMessage("Report ready!");
        setPdfBlob(pdf);
        setIsGenerating(false);

        // Auto-download
        const url = URL.createObjectURL(pdf);
        const link = document.createElement('a');
        link.href = url;
        link.download = `personality-report-${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (err: any) {
        console.error("Error generating PDF:", err);
        setError(err.message || "Failed to generate report. Please try again.");
        setIsGenerating(false);
      }
    };

    generatePDF();
  }, [searchParams]);

  const handleDownload = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `personality-report-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        {error ? (
          <div className="text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Oops!</h1>
            <p className="text-lg text-slate-600 mb-6">{error}</p>
            <a
              href="/quiz"
              className="inline-block rounded-xl bg-[#117B4D] px-6 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-[#0d5f3a]"
            >
              Retake Test
            </a>
          </div>
        ) : isGenerating ? (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-emerald-600 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Generating Your Report</h1>
            <p className="text-lg text-slate-600 mb-6">{generationMessage}</p>
            <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden mb-2">
              <div
                className="bg-[#117B4D] h-4 rounded-full transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
            <p className="text-sm text-slate-500">{generationProgress}%</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Payment Successful! 🎉</h1>
            <p className="text-lg text-slate-600 mb-8">
              Thank you for your purchase! Your personality report is ready to download.
            </p>
            <button
              onClick={handleDownload}
              className="w-full rounded-xl bg-[#117B4D] px-6 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-[#0d5f3a] hover:shadow-xl"
            >
              Download My Report
            </button>
            <p className="mt-4 text-sm text-slate-500">
              Your report has been automatically downloaded. Click the button above to download again if needed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalityPaymentSuccess;

