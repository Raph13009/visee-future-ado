
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Question {
  id: number;
  title: string;
  type: "single" | "text";
  options: string[];
}

interface QuestionCardProps {
  question: Question;
  currentAnswer: string;
  isAnimating: boolean;
  onAnswer: (answer: string) => void;
  onTextAnswer: (value: string) => void;
}

const QuestionCard = ({ 
  question, 
  currentAnswer, 
  isAnimating, 
  onAnswer, 
  onTextAnswer 
}: QuestionCardProps) => {
  const isAnswerSelected = (option: string) => {
    if (!currentAnswer) return false;
    return currentAnswer === option;
  };

  return (
    <Card className={`mb-6 border-0 shadow-lg transition-all duration-300 ${
      isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
    }`}>
      <CardHeader className="pb-3 px-4 sm:px-6">
        <CardTitle className="text-lg sm:text-xl text-primary leading-tight">
          {question.title}
        </CardTitle>
        {question.type === "text" && (
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Réponse libre
          </p>
        )}
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {question.type === "text" ? (
          <textarea
            value={currentAnswer || ""}
            onChange={(e) => onTextAnswer(e.target.value)}
            placeholder="Partage ton rêve professionnel..."
            className="w-full p-4 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 min-h-[120px] resize-none text-sm sm:text-base"
          />
        ) : (
          <div className="space-y-2.5">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => onAnswer(option)}
                className={`w-full p-3 sm:p-4 text-left text-sm sm:text-base rounded-xl border transition-all duration-200 hover:shadow-md transform hover:scale-[1.02] ${
                  isAnswerSelected(option)
                    ? "bg-primary/10 border-primary text-primary font-medium shadow-sm"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start">
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 mr-3 flex-shrink-0 mt-0.5 transition-all duration-200 ${
                    isAnswerSelected(option)
                      ? "bg-primary border-primary scale-110"
                      : "border-gray-300"
                  }`}>
                    {isAnswerSelected(option) && (
                      <div className="w-full h-full rounded-full bg-white scale-50 transition-transform duration-200"></div>
                    )}
                  </div>
                  <span className="leading-relaxed">{option}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
