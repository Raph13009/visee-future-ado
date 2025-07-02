
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface MonthlyCoachingUpsellProps {
  includeMonthlyCoaching: boolean;
  onToggleCoaching: (checked: boolean) => void;
}

const MonthlyCoachingUpsell = ({ includeMonthlyCoaching, onToggleCoaching }: MonthlyCoachingUpsellProps) => {
  return (
    <Card className="border-0 shadow-lg mb-6 bg-gradient-to-r from-orange-50 to-yellow-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="monthly-coaching"
              checked={includeMonthlyCoaching}
              onChange={(e) => onToggleCoaching(e.target.checked)}
              className="w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-primary focus:ring-2"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Plus className="w-4 h-4 text-orange-600" />
              <span className="font-medium text-gray-700">Ajouter un coaching mensuel personnalisé</span>
              <Badge className="bg-orange-100 text-orange-700 text-xs">POPULAIRE</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              4 entretiens individuels (1 par semaine) pour approfondir ton orientation et t'accompagner dans tes démarches
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Valeur: 149€</span>
              <span className="font-bold text-orange-600">+49€ seulement</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyCoachingUpsell;
