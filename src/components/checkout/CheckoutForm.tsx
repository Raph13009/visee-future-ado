import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CheckoutFormProps {
  formData: {
    email: string;
    currentFiliere: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const CheckoutForm = ({ formData, onInputChange }: CheckoutFormProps) => {
  return (
    <Card className="border-0 shadow-lg mb-6">
      <CardHeader className="pb-4 px-4 sm:px-6">
        <CardTitle className="text-lg sm:text-xl text-primary flex items-center gap-2">
          📋 Tes informations personnelles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 sm:px-6">
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            📧 Adresse email
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange("email", e.target.value)}
            className="mt-1 rounded-xl border-gray-200 focus:border-primary focus:ring-primary text-sm sm:text-base"
            placeholder="ton.email@exemple.com (optionnel)"
            required={false}
          />
        </div>

        <div>
          <Label htmlFor="filiere" className="text-sm font-medium text-gray-700">
            🎓 Filière actuelle (optionnel)
          </Label>
          <Input
            id="filiere"
            type="text"
            value={formData.currentFiliere}
            onChange={(e) => onInputChange("currentFiliere", e.target.value)}
            className="mt-1 rounded-xl border-gray-200 focus:border-primary focus:ring-primary text-sm sm:text-base"
            placeholder="Ex: Terminale Générale, Bac Pro, etc."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;
