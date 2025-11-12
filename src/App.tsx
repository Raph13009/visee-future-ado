
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Test from "./pages/Test";
import TestRiasec from "./pages/TestRiasec";
import TestPersonnalite from "./pages/TestPersonnalite";
import PreviewReport from "./pages/PreviewReport";
import ResultsRiasec from "./pages/ResultsRiasec";
import PaymentSuccess from "./pages/PaymentSuccess";
import Checkout from "./pages/Checkout";
import Results from "./pages/Results";
import Coaching from "./pages/Coaching";
import CoachingSuccess from "./pages/CoachingSuccess";
import OrientationScolaire from "./pages/OrientationScolaire";
import ReconversionPro from "./pages/ReconversionPro";
import BilanPublic from "./pages/BilanPublic";
import QuiSommesNous from "./pages/QuiSommesNous";
import AccesResultats from "./pages/AccesResultats";
import ConseilsReconversion from "./pages/ConseilsReconversion";
import MetierReconversion40Ans from "./pages/MetierReconversion40Ans";
import MetiersReconversion40AnsSansDiplome from "./pages/MetiersReconversion40AnsSansDiplome";
import TestOrientationProfessionnelleAdulte from "./pages/TestOrientationProfessionnelleAdulte";
import BilanOrientationProfessionnelleAdulte from "./pages/BilanOrientationProfessionnelleAdulte";
import Ressources from "./pages/Ressources";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/test" element={<Test />} />
          <Route path="/test-riasec" element={<TestRiasec />} />
          <Route path="/test-personnalite" element={<TestPersonnalite />} />
          <Route path="/preview/report" element={<PreviewReport />} />
          <Route path="/resultats-riasec" element={<ResultsRiasec />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/results" element={<Results />} />
          <Route path="/coaching" element={<Coaching />} />
          <Route path="/coaching-success" element={<CoachingSuccess />} />
          <Route path="/bilan-orientation-scolaire" element={<OrientationScolaire />} />
          <Route path="/bilan-reconversion-professionnelle" element={<ReconversionPro />} />
          <Route path="/bilan-competences-tous-publics" element={<BilanPublic />} />
          <Route path="/qui-sommes-nous" element={<QuiSommesNous />} />
          <Route path="/acces-resultats" element={<AccesResultats />} />
          <Route path="/conseils-reconversion-professionnelle" element={<ConseilsReconversion />} />
          <Route path="/metier-reconversion-40-ans" element={<MetierReconversion40Ans />} />
          <Route path="/5-metiers-reconversion-40-ans-sans-diplome" element={<MetiersReconversion40AnsSansDiplome />} />
          <Route path="/test-orientation-professionnelle-adulte" element={<TestOrientationProfessionnelleAdulte />} />
          <Route path="/bilan-orientation-professionnelle-adulte" element={<BilanOrientationProfessionnelleAdulte />} />
          <Route path="/ressources" element={<Ressources />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
