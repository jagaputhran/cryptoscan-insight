import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Search, 
  GitBranch, 
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
  Eye,
  RotateCcw
} from 'lucide-react';
import { SummaryMetrics } from '@/types/analysis';

interface ResultsOverviewProps {
  summary: SummaryMetrics;
  totalFindings: number;
  criticalFindings: number;
  warningFindings: number;
}

export const ResultsOverview: React.FC<ResultsOverviewProps> = ({
  summary,
  totalFindings,
  criticalFindings,
  warningFindings
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(false), 3000);
    return () => clearTimeout(timer);
  }, []);
  const getSeverityColor = (critical: number, warning: number, total: number) => {
    if (critical > 0) return 'text-destructive';
    if (warning > 0) return 'text-warning';
    return 'text-success';
  };

  const getSeverityIcon = (critical: number, warning: number) => {
    if (critical > 0) return <XCircle className="w-4 h-4 animate-pulse" />;
    if (warning > 0) return <AlertTriangle className="w-4 h-4 animate-bounce" />;
    return <CheckCircle className="w-4 h-4 animate-pulse text-success" />;
  };

  const cards = [
    {
      id: 'repository',
      title: 'Repository',
      value: summary.repositoryName,
      subtitle: `${summary.scanDuration}`,
      icon: GitBranch,
      color: 'from-primary/10 to-accent/10',
      iconColor: 'text-primary',
      trend: null
    },
    {
      id: 'files',
      title: 'Files Analyzed',
      value: summary.filesAnalyzed.toLocaleString(),
      subtitle: `Scanned on ${new Date(summary.analysisDate).toLocaleDateString()}`,
      icon: FileText,
      color: 'from-blue-500/10 to-cyan-500/10',
      iconColor: 'text-blue-500',
      trend: '+' + Math.floor(Math.random() * 20)
    },
    {
      id: 'findings',
      title: 'Total Findings',
      value: totalFindings.toLocaleString(),
      subtitle: `${summary.totalFindings} algorithms`,
      icon: Search,
      color: 'from-purple-500/10 to-pink-500/10',
      iconColor: 'text-purple-500',
      trend: totalFindings > 50 ? 'High Activity' : 'Normal'
    },
    {
      id: 'security',
      title: 'Security Status',
      value: criticalFindings > 0 ? 'Critical' : warningFindings > 0 ? 'Warning' : 'Good',
      subtitle: `${criticalFindings} critical, ${warningFindings} warnings`,
      icon: Shield,
      color: criticalFindings > 0 
        ? 'from-destructive/10 to-red-500/10'
        : warningFindings > 0
        ? 'from-warning/10 to-orange-500/10'
        : 'from-success/10 to-green-500/10',
      iconColor: getSeverityColor(criticalFindings, warningFindings, totalFindings),
      trend: criticalFindings > 0 ? 'Needs Attention' : 'Stable'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <Card 
          key={card.id}
          className={`relative overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer ${
            showAnimation ? 'animate-fade-in' : ''
          }`}
          style={{ animationDelay: `${index * 150}ms` }}
          onMouseEnter={() => setHoveredCard(card.id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${card.color} transition-opacity duration-300 ${
            hoveredCard === card.id ? 'opacity-30' : 'opacity-100'
          }`} />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`transition-all duration-300 ${hoveredCard === card.id ? 'scale-110' : ''}`}>
              <card.icon className={`h-4 w-4 ${card.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className={`text-2xl font-bold transition-all duration-300 ${
              card.id === 'repository' ? 'truncate' : ''
            }`} title={card.id === 'repository' ? card.value : undefined}>
              {card.value}
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {card.id === 'repository' && <Clock className="w-3 h-3" />}
                {card.subtitle}
              </p>
              
              {card.trend && (
                <div className="flex items-center gap-1">
                  {typeof card.trend === 'string' && card.trend.includes('+') ? (
                    <TrendingUp className="w-3 h-3 text-success" />
                  ) : (
                    <Activity className="w-3 h-3 text-muted-foreground" />
                  )}
                  <span className="text-xs text-muted-foreground">{card.trend}</span>
                </div>
              )}
            </div>

            {/* Additional badges for specific cards */}
            {card.id === 'findings' && (
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {summary.totalFindings} algorithms
                </Badge>
              </div>
            )}

            {card.id === 'security' && (
              <div className="flex gap-2 mt-2">
                {criticalFindings > 0 && (
                  <Badge variant="destructive" className="text-xs animate-pulse">
                    {criticalFindings} critical
                  </Badge>
                )}
                {warningFindings > 0 && (
                  <Badge className="text-xs bg-warning text-warning-foreground">
                    {warningFindings} warnings
                  </Badge>
                )}
                {criticalFindings === 0 && warningFindings === 0 && (
                  <Badge variant="outline" className="text-xs text-success">
                    No issues
                  </Badge>
                )}
              </div>
            )}

            {/* Interactive hover effect */}
            {hoveredCard === card.id && (
              <div className="absolute top-2 right-2 opacity-50">
                <Eye className="w-3 h-3" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};