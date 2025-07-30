import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  LibraryStatistic, 
  AlgorithmStatistic, 
  AlgorithmTypeStatistic 
} from '@/types/analysis';

interface ChartsSectionProps {
  libraryStats: LibraryStatistic[];
  algorithmStats: AlgorithmStatistic[];
  algorithmTypeStats: AlgorithmTypeStatistic[];
}

const COLORS = ['bg-blue-500', 'bg-purple-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-cyan-500', 'bg-pink-500', 'bg-lime-500'];

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  libraryStats,
  algorithmStats,
  algorithmTypeStats
}) => {
  const maxLibraryCount = Math.max(...libraryStats.map(s => s.count));
  const maxAlgorithmCount = Math.max(...algorithmStats.map(s => s.count));
  const maxTypeCount = Math.max(...algorithmTypeStats.map(s => s.count));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Library Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Library Distribution</CardTitle>
          <CardDescription>
            Cryptographic libraries detected in the codebase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {libraryStats.slice(0, 10).map((stat, index) => (
              <div key={stat.library} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{stat.library}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {stat.count} uses
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {stat.confidence}
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={(stat.count / maxLibraryCount) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Types */}
      <Card>
        <CardHeader>
          <CardTitle>Algorithm Types</CardTitle>
          <CardDescription>
            Distribution of cryptographic algorithm types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {algorithmTypeStats.map((stat, index) => (
              <div key={stat.type} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{stat.type}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {stat.count} algorithms
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {stat.percentage}%
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={(stat.count / maxTypeCount) * 100} 
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground">
                  {stat.algorithms.slice(0, 3).join(', ')}
                  {stat.algorithms.length > 3 && ` +${stat.algorithms.length - 3} more`}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Algorithms */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Most Common Algorithms</CardTitle>
          <CardDescription>
            Frequently detected cryptographic algorithms with confidence scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
            {algorithmStats.slice(0, 15).map((stat, index) => (
              <div key={stat.algorithm} className="space-y-2 p-3 rounded-lg border bg-card">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{stat.algorithm}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {stat.count}x
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Confidence</span>
                    <span>{stat.averageConfidence}%</span>
                  </div>
                  <Progress 
                    value={stat.averageConfidence} 
                    className="h-1.5"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Usage</span>
                    <span>{stat.percentage}%</span>
                  </div>
                  <Progress 
                    value={(stat.count / maxAlgorithmCount) * 100} 
                    className="h-1.5"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};