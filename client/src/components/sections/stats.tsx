import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
  disposalPoints: number;
  monthlyWaste: string;
  recyclableRate: string;
  activeUsers: string;
}

export default function Stats() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
    retry: false,
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-12 w-20 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const defaultStats = {
    disposalPoints: 0,
    monthlyWaste: "0T",
    recyclableRate: "0%",
    activeUsers: "0",
  };

  const currentStats = stats || defaultStats;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-forest mb-2">
              {currentStats.disposalPoints}
            </div>
            <p className="text-text-dark">Disposal Points</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-eco mb-2">
              {currentStats.monthlyWaste}
            </div>
            <p className="text-text-dark">Monthly Waste</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-warning mb-2">
              {currentStats.recyclableRate}
            </div>
            <p className="text-text-dark">Recyclable Rate</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-university mb-2">
              {currentStats.activeUsers}
            </div>
            <p className="text-text-dark">Active Users</p>
          </div>
        </div>
      </div>
    </section>
  );
}
