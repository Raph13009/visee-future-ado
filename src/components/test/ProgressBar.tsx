
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const remainingQuestions = totalSteps - (currentStep + 1);

  return (
    <div className="mb-8 animate-fade-in">
      {/* Texte discret en haut */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-medium" style={{ color: '#6B7280' }}>
          {remainingQuestions > 0 ? `${remainingQuestions} question${remainingQuestions > 1 ? 's' : ''} restante${remainingQuestions > 1 ? 's' : ''}` : 'Dernière question'}
        </span>
        <span className="text-xs font-semibold" style={{ color: '#1A1A1A' }}>
          {currentStep + 1}/{totalSteps}
        </span>
      </div>
      
      {/* Barre de progression neobrutalist */}
      <div 
        className="relative transition-all duration-500 ease-out rounded-lg overflow-hidden"
        style={{
          height: '6px',
          background: '#E5E5E5',
          border: '2px solid #1A1A1A',
          boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.1)'
        }}
      >
        <div 
          className="h-full transition-all duration-500 ease-out"
          style={{ 
            width: `${progress}%`,
            background: '#E96A3C',
            borderRight: '2px solid #1A1A1A',
            boxShadow: '2px 0 0 rgba(0,0,0,0.05)'
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
