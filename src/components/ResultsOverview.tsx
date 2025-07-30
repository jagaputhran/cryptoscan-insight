import React from 'react';
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
  XCircle
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
  const getSeverityColor = (critical: number, warning: number, total: number) => {
    if (critical > 0) return 'text-destructive';
    if (warning > 0) return 'text-warning';
    return 'text-success';
  };

  const getSeverityIcon = (critical: number, warning: number) => {
    if (critical > 0) return <XCircle className="w-4 h-4" />;
    if (warning > 0) return <AlertTriangle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Repository Info */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Repository</CardTitle>
          <GitBranch className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-lg font-bold truncate" title={summary.repositoryName}>
            {summary.repositoryName}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" />
            {summary.scanDuration}
          </p>
        </CardContent>
      </Card>

      {/* Files Analyzed */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10" />
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Files Analyzed</CardTitle>
          <FileText className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl font-bold">{summary.filesAnalyzed.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Scanned on {new Date(summary.analysisDate).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      {/* Total Findings */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Findings</CardTitle>
          <Search className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl font-bold">{totalFindings.toLocaleString()}</div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {summary.totalFindings} algorithms
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Security Status */}
      <Card className="relative overflow-hidden">
        <div className={`absolute inset-0 ${
          criticalFindings > 0 
            ? 'bg-gradient-to-br from-destructive/10 to-red-500/10'
            : warningFindings > 0
            ? 'bg-gradient-to-br from-warning/10 to-orange-500/10'
            : 'bg-gradient-to-br from-success/10 to-green-500/10'
        }`} />
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Security Status</CardTitle>
          <Shield className={`h-4 w-4 ${getSeverityColor(criticalFindings, warningFindings, totalFindings)}`} />
        </CardHeader>
        <CardContent className="relative">
          <div className={`text-2xl font-bold flex items-center gap-2 ${getSeverityColor(criticalFindings, warningFindings, totalFindings)}`}>
            {getSeverityIcon(criticalFindings, warningFindings)}
            {criticalFindings > 0 ? 'Critical' : warningFindings > 0 ? 'Warning' : 'Good'}
          </div>
          <div className="flex gap-2 mt-1">
            {criticalFindings > 0 && (
              <Badge variant="destructive" className="text-xs">
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
        </CardContent>
      </Card>
    </div>
  );
};