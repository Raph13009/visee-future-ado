import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ReportPage from "@/lib/report/ReportPage";
import type { AnswersState } from "@/pages/TestPersonnalite";
// Note: report-styles.css is imported in ReportPage.tsx

const ReportPreview = () => {
  const [searchParams] = useSearchParams();
  const [answers, setAnswers] = useState<AnswersState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set a flag to indicate page is loaded (even if with error)
  useEffect(() => {
    // Mark page as loaded after a short delay to help Puppeteer detect it
    const timer = setTimeout(() => {
      const container = document.querySelector('.report-container') || document.body;
      if (container) {
        container.setAttribute('data-page-loaded', 'true');
        console.log("[ReportPreview] Page marked as loaded");
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [loading, error, answers]);

  useEffect(() => {
    try {
      const encodedAnswers = searchParams.get("answers");
      if (!encodedAnswers) {
        setError("No answers provided in URL parameters");
        setLoading(false);
        return;
      }

      console.log("[ReportPreview] Decoding answers, length:", encodedAnswers.length);
      
      // Decode base64 and parse JSON with better error handling
      let decoded: string;
      try {
        decoded = decodeURIComponent(atob(encodedAnswers));
        console.log("[ReportPreview] Decoded length:", decoded.length);
        console.log("[ReportPreview] Decoded preview:", decoded.substring(0, 100));
      } catch (decodeError) {
        console.error("[ReportPreview] Base64 decode error:", decodeError);
        throw new Error(`Invalid base64 encoding: ${decodeError instanceof Error ? decodeError.message : 'Unknown error'}`);
      }

      let parsedAnswers: AnswersState;
      try {
        parsedAnswers = JSON.parse(decoded);
        console.log("[ReportPreview] JSON parsed successfully");
        console.log("[ReportPreview] Answer keys:", Object.keys(parsedAnswers));
      } catch (parseError) {
        console.error("[ReportPreview] JSON parse error:", parseError);
        console.error("[ReportPreview] Decoded content:", decoded);
        throw new Error(`Invalid JSON format: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }

      // Validate answers structure
      if (!parsedAnswers || typeof parsedAnswers !== 'object') {
        throw new Error("Answers must be an object");
      }

      setAnswers(parsedAnswers);
      setLoading(false);
    } catch (err) {
      console.error("[ReportPreview] Error parsing answers:", err);
      const errorMessage = err instanceof Error ? err.message : "Invalid answers format. Please try again.";
      setError(errorMessage);
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div 
        data-page-loaded="false"
        style={{ padding: "40px", textAlign: "center", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div>
          <div style={{ fontSize: "18px", marginBottom: "10px" }}>Loading report...</div>
          <div style={{ fontSize: "14px", color: "#666" }}>Please wait while we prepare your report</div>
        </div>
      </div>
    );
  }

  if (error || !answers) {
    return (
      <div 
        data-page-loaded="true"
        className="report-error-page"
        style={{ padding: "40px", textAlign: "center", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div>
          <div style={{ color: "red", fontSize: "18px", marginBottom: "10px" }}>
            {error || "Failed to load report data"}
          </div>
          <div style={{ fontSize: "14px", color: "#666", marginTop: "20px" }}>
            <p>This page requires valid answer data.</p>
            <p>Please complete the personality test to generate a report.</p>
          </div>
        </div>
      </div>
    );
  }

  return <ReportPage answers={answers} />;
};

export default ReportPreview;

