import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Recycle, Leaf, Trash2, Building2 } from "lucide-react";

interface InfoModalProps {
  type: string;
  isOpen: boolean;
  onClose: () => void;
}

const infoContent = {
  university: {
    title: "University of Peradeniya Waste Management System",
    icon: <Building2 className="h-6 w-6 text-blue-600" />,
    content: (
      <div className="space-y-6">
        <div>
          <p className="text-gray-700 mb-4">
            The University of Peradeniya has implemented a structured waste
            management system coordinated by its Waste Management Division,
            handling various waste streams including general waste, recyclables,
            chemical waste, and electronic waste.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-forest">
            1. Waste Segregation and Collection
          </h4>
          <ul className="list-disc list-inside mb-3 space-y-1 text-gray-600">
            <li>80 satellite waste storage points across University</li>
            <li>Initial segregation handled by Waste Management Division</li>
            <li>Faculty-specific storage points (e.g., Faculty of Science)</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-forest">
            2. Transportation Fleet
          </h4>
          <ul className="list-disc list-inside mb-3 space-y-1 text-gray-600">
            <li>1 Lorry for daily collection</li>
            <li>1 Tractor for University transport</li>
            <li>1 Compactor vehicle (operates Tuesdays & Thursdays)</li>
            <li>Collection schedule: 5 days per week</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-forest">
            3. Recyclable Materials
          </h4>
          <ul className="list-disc list-inside mb-3 space-y-1 text-gray-600">
            <li>
              Plastic bottles and waste → Private companies via tender system
            </li>
            <li>Paper waste → Recycling partnerships</li>
            <li>Effective diversion from landfills</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-forest">
            4. Incineration Facility
          </h4>
          <ul className="list-disc list-inside mb-3 space-y-1 text-gray-600">
            <li>Located in Upper Hantana</li>
            <li>Operates 6-7 hours per week</li>
            <li>Handles non-reusable polythene and lunch sheets</li>
            <li>Eliminated external disposal cost of LKR 18,000/day</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-forest">
            5. Specialized Waste Streams
          </h4>
          <ul className="list-disc list-inside mb-3 space-y-1 text-gray-600">
            <li>
              <strong>Food Waste:</strong> Good condition waste used as animal
              feed for university farm
            </li>
            <li>
              <strong>E-waste:</strong> Temporarily stored, then handled by
              authorized private companies
            </li>
            <li>
              <strong>Chemical Waste:</strong> Laboratory waste managed through
              competitive tendering
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-800">Key Challenge</h4>
          <p className="text-blue-700 text-sm">
            System efficiency is limited by lack of waste segregation at the
            source. Community participation and awareness are essential for
            improving sustainability.
          </p>
        </div>
      </div>
    ),
  },
  chemical: {
    title: "Chemical Waste Management",
    icon: <Recycle className="h-6 w-6 text-red-600" />,
    content: (
      <div>
        <h4 className="font-semibold mb-3 text-forest">
          Chemical Waste Types:
        </h4>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Laboratory chemicals and reagents</li>
          <li>Acids, bases, and solvents</li>
          <li>Expired or unused chemicals</li>
          <li>Contaminated glassware and containers</li>
        </ul>
        <h4 className="font-semibold mb-3 text-forest">Safety Procedures:</h4>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Always wear appropriate PPE when handling</li>
          <li>Label all containers clearly with contents and date</li>
          <li>Never mix different chemical wastes</li>
          <li>Store in designated areas away from incompatible materials</li>
        </ul>
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-red-800">Important Notice</h4>
          <p className="text-red-700 text-sm">
            Chemical waste disposal requires special authorization and must be
            handled through the university's certified waste management program.
            Contact the lab safety coordinator for proper disposal procedures.
          </p>
        </div>
      </div>
    ),
  },
  paper: {
    title: "Paper Waste Management",
    icon: <Leaf className="h-6 w-6 text-blue-600" />,
    content: (
      <div>
        <h4 className="font-semibold mb-3 text-forest">
          Recyclable Paper Items:
        </h4>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Office paper and documents</li>
          <li>Newspapers and magazines</li>
          <li>Cardboard boxes and packaging</li>
          <li>Books and notebooks (remove bindings)</li>
        </ul>
        <h4 className="font-semibold mb-3 text-forest">
          Preparation Guidelines:
        </h4>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Remove all staples, clips, and plastic bindings</li>
          <li>Keep paper clean and dry</li>
          <li>Separate different paper types when possible</li>
          <li>Flatten cardboard boxes to save space</li>
        </ul>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-800">
            Recycling Benefits
          </h4>
          <p className="text-blue-700 text-sm">
            Paper recycling saves trees, reduces water usage, and decreases
            landfill waste. One ton of recycled paper saves approximately 17
            trees and 3.3 cubic yards of landfill space.
          </p>
        </div>
      </div>
    ),
  },
  ewaste: {
    title: "Electronic Waste Management",
    icon: <Trash2 className="h-6 w-6 text-purple-600" />,
    content: (
      <div>
        <h4 className="font-semibold mb-3 text-forest">E-Waste Items:</h4>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Computers, laptops, and tablets</li>
          <li>Mobile phones and chargers</li>
          <li>Printers, scanners, and copiers</li>
          <li>Electronic components and circuit boards</li>
        </ul>
        <h4 className="font-semibold mb-3 text-forest">Data Security:</h4>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Ensure all personal data is completely removed</li>
          <li>Perform factory resets on devices</li>
          <li>Remove or destroy hard drives if necessary</li>
          <li>Keep certificates of data destruction</li>
        </ul>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-purple-800">
            Environmental Impact
          </h4>
          <p className="text-purple-700 text-sm">
            E-waste contains valuable materials like gold, silver, and rare
            earth elements that can be recovered. Proper disposal prevents toxic
            materials from entering the environment and allows valuable
            resources to be reused.
          </p>
        </div>
      </div>
    ),
  },
  general: {
    title: "General Waste Guidelines",
    icon: <Trash2 className="h-6 w-6 text-gray-500" />,
    content: (
      <div>
        <h4 className="font-semibold mb-3 text-forest">General Waste Items:</h4>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Food waste and leftovers</li>
          <li>Plastic packaging and containers</li>
          <li>Polythene bags and wrappers</li>
          <li>Mixed material items that cannot be separated</li>
        </ul>
        <h4 className="font-semibold mb-3 text-forest">Disposal Guidelines:</h4>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Separate food waste when possible for composting</li>
          <li>Clean containers before disposal</li>
          <li>Avoid mixing with recyclable materials</li>
          <li>Use designated general waste bins</li>
        </ul>
        <h4 className="font-semibold mb-3 text-forest">Reduction Tips:</h4>
        <p className="text-gray-600">
          Minimize general waste by bringing reusable containers, avoiding
          single-use plastics, and choosing products with minimal packaging.
        </p>
      </div>
    ),
  },
};

export default function InfoModal({ type, isOpen, onClose }: InfoModalProps) {
  const info = infoContent[type as keyof typeof infoContent];

  if (!info) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-4xl ${
          type === "university" ? "max-h-[80vh]" : "max-h-96"
        } overflow-y-auto`}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {info.icon}
            <span className="ml-2">{info.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">{info.content}</div>
      </DialogContent>
    </Dialog>
  );
}
