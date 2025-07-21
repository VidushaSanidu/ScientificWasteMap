import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Recycle, Leaf, Trash2 } from "lucide-react";

interface InfoModalProps {
  type: string;
  isOpen: boolean;
  onClose: () => void;
}

const infoContent = {
  recycling: {
    title: 'Recycling Guidelines',
    icon: <Recycle className="h-6 w-6 text-eco" />,
    content: (
      <div>
        <h4 className="font-semibold mb-3 text-forest">What Can Be Recycled:</h4>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Paper and cardboard (clean and dry)</li>
          <li>Plastic bottles and containers (types 1-7)</li>
          <li>Aluminum cans and metal containers</li>
          <li>Glass bottles and jars</li>
        </ul>
        <h4 className="font-semibold mb-3 text-forest">Cannot Be Recycled:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Food-contaminated materials</li>
          <li>Medical waste or hazardous materials</li>
          <li>Electronics (requires special disposal)</li>
        </ul>
      </div>
    )
  },
  organic: {
    title: 'Organic Waste Management',
    icon: <Leaf className="h-6 w-6 text-yellow-600" />,
    content: (
      <div>
        <h4 className="font-semibold mb-3 text-forest">Acceptable Organic Waste:</h4>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Food scraps and leftovers</li>
          <li>Fruit and vegetable peels</li>
          <li>Coffee grounds and tea bags</li>
          <li>Paper napkins and tissues</li>
        </ul>
        <h4 className="font-semibold mb-3 text-forest">Composting Process:</h4>
        <p className="text-gray-600">
          Our organic waste is processed in on-campus composting facilities, creating nutrient-rich soil for campus landscaping.
        </p>
      </div>
    )
  },
  general: {
    title: 'General Waste Guidelines',
    icon: <Trash2 className="h-6 w-6 text-gray-500" />,
    content: (
      <div>
        <h4 className="font-semibold mb-3 text-forest">General Waste Items:</h4>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Items that cannot be recycled or composted</li>
          <li>Contaminated materials</li>
          <li>Mixed material items</li>
          <li>Damaged or broken non-recyclable items</li>
        </ul>
        <h4 className="font-semibold mb-3 text-forest">Reduction Tips:</h4>
        <p className="text-gray-600">
          Minimize general waste by choosing reusable alternatives and properly sorting recyclable and organic materials.
        </p>
      </div>
    )
  }
};

export default function InfoModal({ type, isOpen, onClose }: InfoModalProps) {
  const info = infoContent[type as keyof typeof infoContent];
  
  if (!info) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {info.icon}
            <span className="ml-2">{info.title}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {info.content}
        </div>
      </DialogContent>
    </Dialog>
  );
}
