
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const CheckoutTestimonial = () => {
  return (
    <Card className="border-0 shadow-lg mb-6 bg-gradient-to-r from-green-50 to-blue-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            ⭐
          </div>
          <div>
            <p className="text-sm italic text-gray-700 mb-2">
              "Grâce à ce coaching, j'ai enfin trouvé ma voie ! Le test m'a ouvert les yeux sur mes vrais talents."
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <div className="flex text-yellow-400">
                <Star className="w-3 h-3" fill="currentColor" />
                <Star className="w-3 h-3" fill="currentColor" />
                <Star className="w-3 h-3" fill="currentColor" />
                <Star className="w-3 h-3" fill="currentColor" />
                <Star className="w-3 h-3" fill="currentColor" />
              </div>
              <span className="ml-1">- Sarah M., Terminale S</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutTestimonial;
