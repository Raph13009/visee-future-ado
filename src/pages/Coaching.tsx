import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import CoachingFlow from "@/components/coaching/CoachingFlow";

const Coaching = () => {
  const [searchParams] = useSearchParams();
  const step = searchParams.get('step') as 'cta' | 'presentation' | 'booking' | null;

  return (
    <div className="min-h-screen">
      <Header hideTestCTA={true} />
      <div className="pt-20">
        <CoachingFlow 
          initialStep={step || 'presentation'} 
          showCTA={false}
        />
      </div>
    </div>
  );
};

export default Coaching; 