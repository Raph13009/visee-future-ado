
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs sm:text-sm font-medium text-primary">
          Question {currentStep + 1} sur {totalSteps}
        </span>
        <span className="text-xs sm:text-sm text-gray-500">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-2 bg-gray-200 transition-all duration-500 ease-out rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
