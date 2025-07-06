import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface CgvModalProps {
  open: boolean;
  onClose: () => void;
}

const CGV_TEXT = `🧾 Conditions Générales de Vente (CGV) — Avenirea

1. Objet
Avenirea propose un test d'orientation en ligne destiné à aider les jeunes dans leurs choix post-bac. Le service est accessible via le site www.avenirea.com.

2. Public concerné
Le test est conçu principalement pour les jeunes de 15 ans et plus, en phase de réflexion sur leur avenir scolaire ou professionnel.

3. Consentement parental
Si vous avez moins de 18 ans, vous devez obtenir l'accord d'un parent ou représentant légal avant d'acheter un test Avenirea.
Toute commande effectuée par un mineur est réputée avoir été validée avec l'autorisation de ses parents.

4. Prix et paiement
Le prix du test est indiqué en euros TTC au moment de l'achat. Le paiement se fait en ligne, via une plateforme sécurisée.
Aucun abonnement ni frais caché ne sont associés à l'achat.

5. Rétractation et remboursement
Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux contenus numériques entièrement exécutés après accord préalable du consommateur.
Cependant, en cas de problème ou d'achat effectué par erreur, un remboursement pourra être envisagé sous 14 jours — il suffit de nous contacter à contact@boostaiconsulting.com.

6. Protection des données
Les données saisies sont strictement confidentielles et ne sont jamais revendues.
Pour les mineurs de moins de 15 ans, nous ne collectons aucune information personnelle sans le consentement explicite des parents.

7. Responsabilité
Avenirea ne garantit pas une orientation parfaite ou un choix sans erreur. Le test est un outil d'accompagnement, pas une garantie de réussite.
L'utilisateur reste pleinement responsable de ses décisions postérieures.`;

const CgvModal = ({ open, onClose }: CgvModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Conditions Générales de Vente</DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <div className="text-sm whitespace-pre-line text-gray-700 max-h-[60vh] overflow-y-auto">
            {CGV_TEXT}
          </div>
        </DialogDescription>
        <button
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition"
          onClick={onClose}
        >
          Fermer
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default CgvModal; 