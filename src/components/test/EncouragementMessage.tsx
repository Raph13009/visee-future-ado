
interface EncouragementMessageProps {
  currentStep: number;
}

const EncouragementMessage = ({ currentStep }: EncouragementMessageProps) => {
  const encouragementMessages = [
    "Excellente première question ! Continuons ensemble 🚀",
    "Tu prends forme ! Encore quelques questions 💪",
    "C'est parfait ! On avance bien 🎯",
    "Super ! Tu es à mi-parcours 🌟",
    "Génial ! On progresse 🔥",
    "Très bien ! Plus que quelques questions 💫",
    "Excellent ! Tu touches au but 🎊",
    "Parfait ! Dernière ligne droite 🏁",
    "Bravo ! Une dernière question 🎉",
    "Dernière question, tu y es presque ! 🎁"
  ];

  return (
    <div className="text-center">
      <p className="text-gray-600 text-sm animate-fade-in">
        {encouragementMessages[currentStep]}
      </p>
    </div>
  );
};

export default EncouragementMessage;
