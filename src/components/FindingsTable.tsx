import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronRight, 
  Code, 
  FileText, 
  Search,
  Filter,
  AlertCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Finding } from '@/types/analysis';

interface FindingsTableProps {
  findings: Finding[];
}

export const FindingsTable: React.FC<FindingsTableProps> = ({ findings }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [algorithmFilter, setAlgorithmFilter] = useState<string>('all');
  const [expandedFindings, setExpandedFindings] = useState<Set<string>>(new Set());

  const filteredFindings = useMemo(() => {
    return findings.filter(finding => {
      const matchesSearch = 
        finding.algorithm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        finding.filePath.toLowerCase().includes(searchTerm.toLowerCase()) ||
        finding.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSeverity = severityFilter === 'all' || finding.severity === severityFilter;
      const matchesAlgorithm = algorithmFilter === 'all' || finding.algorithm === algorithmFilter;

      return matchesSearch && matchesSeverity && matchesAlgorithm;
    });
  }, [findings, searchTerm, severityFilter, algorithmFilter]);

  const uniqueAlgorithms = useMemo(() => {
    return Array.from(new Set(findings.map(f => f.algorithm))).sort();
  }, [findings]);

  const toggleExpanded = (findingId: string) => {
    const newExpanded = new Set(expandedFindings);
    if (newExpanded.has(findingId)) {
      newExpanded.delete(findingId);
    } else {
      newExpanded.add(findingId);
    }
    setExpandedFindings(newExpanded);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">{severity}</Badge>;
      case 'warning':
        return <Badge className="bg-warning text-warning-foreground">{severity}</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) {
      return <Badge variant="outline" className="text-success">High ({confidence}%)</Badge>;
    } else if (confidence >= 75) {
      return <Badge variant="outline" className="text-warning">Medium ({confidence}%)</Badge>;
    } else {
      return <Badge variant="outline" className="text-muted-foreground">Low ({confidence}%)</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Detailed Findings ({filteredFindings.length})
        </CardTitle>
        <CardDescription>
          Cryptographic algorithms and libraries detected in your codebase
        </CardDescription>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search algorithms, files, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>

          <Select value={algorithmFilter} onValueChange={setAlgorithmFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Algorithms</SelectItem>
              {uniqueAlgorithms.map(algorithm => (
                <SelectItem key={algorithm} value={algorithm}>
                  {algorithm}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {filteredFindings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No findings match your current filters
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFindings.map((finding) => (
              <Collapsible
                key={finding.id}
                open={expandedFindings.has(finding.id)}
                onOpenChange={() => toggleExpanded(finding.id)}
              >
                <Card className="border shadow-sm">
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start p-4 h-auto hover:bg-muted/50"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          {expandedFindings.has(finding.id) ? 
                            <ChevronDown className="w-4 h-4" /> : 
                            <ChevronRight className="w-4 h-4" />
                          }
                          {getSeverityIcon(finding.severity)}
                          <div className="text-left">
                            <div className="font-medium">{finding.algorithm}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-96">
                              {finding.filePath}:{finding.lineNumber}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getSeverityBadge(finding.severity)}
                          {getConfidenceBadge(finding.confidence)}
                        </div>
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="px-4 pb-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Algorithm Type:</strong> {finding.algorithmType}
                        </div>
                        <div>
                          <strong>Confidence:</strong> {finding.confidence}% ({finding.confidenceLevel})
                        </div>
                        <div className="md:col-span-2">
                          <strong>Description:</strong> {finding.description}
                        </div>
                      </div>
                      
                      {finding.codeSnippet && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Code className="w-4 h-4" />
                            <strong className="text-sm">Code Snippet</strong>
                          </div>
                          <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                            <code>{finding.codeSnippet}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};