import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  FileText, 
  Download, 
  Code,
  Database,
  TrendingUp
} from 'lucide-react';
import { ResultsOverview } from './ResultsOverview';
import { ChartsSection } from './ChartsSection';
import { FindingsTable } from './FindingsTable';
import { ExportTools } from './ExportTools';
import { AnalysisResult } from '@/types/analysis';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const criticalFindings = result.findings.filter(f => f.severity === 'critical').length;
  const warningFindings = result.findings.filter(f => f.severity === 'warning').length;
  const infoFindings = result.findings.filter(f => f.severity === 'info').length;

  const RawDataViewer = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-4 h-4" />
              <h4 className="font-medium">JSON Data</h4>
              <Badge variant="outline">{Math.round(result.rawData.json.length / 1024)}KB</Badge>
            </div>
            <div className="bg-muted rounded-md p-3 max-h-96 overflow-auto">
              <pre className="text-xs">
                <code>{JSON.stringify(JSON.parse(result.rawData.json), null, 2)}</code>
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4" />
              <h4 className="font-medium">CSV Preview</h4>
              <Badge variant="outline">{Math.round(result.rawData.csv.length / 1024)}KB</Badge>
            </div>
            <div className="bg-muted rounded-md p-3 max-h-96 overflow-auto">
              <pre className="text-xs">
                <code>{result.rawData.csv.split('\n').slice(0, 20).join('\n')}</code>
              </pre>
              {result.rawData.csv.split('\n').length > 20 && (
                <div className="text-xs text-muted-foreground mt-2">
                  ... and {result.rawData.csv.split('\n').length - 20} more rows
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <ResultsOverview
        summary={result.summary}
        totalFindings={result.findings.length}
        criticalFindings={criticalFindings}
        warningFindings={warningFindings}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Charts</span>
          </TabsTrigger>
          <TabsTrigger value="findings" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Findings</span>
            <Badge variant="secondary" className="ml-1">
              {result.findings.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="raw" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            <span className="hidden sm:inline">Raw Data</span>
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {result.libraryStats.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Libraries Detected</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {result.algorithmStats.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Unique Algorithms</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {result.algorithmTypeStats.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Algorithm Types</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <ChartsSection
            libraryStats={result.libraryStats}
            algorithmStats={result.algorithmStats}
            algorithmTypeStats={result.algorithmTypeStats}
          />
        </TabsContent>

        <TabsContent value="charts">
          <ChartsSection
            libraryStats={result.libraryStats}
            algorithmStats={result.algorithmStats}
            algorithmTypeStats={result.algorithmTypeStats}
          />
        </TabsContent>

        <TabsContent value="findings">
          <FindingsTable findings={result.findings} />
        </TabsContent>

        <TabsContent value="raw">
          <RawDataViewer />
        </TabsContent>

        <TabsContent value="export">
          <ExportTools result={result} />
        </TabsContent>
      </Tabs>
    </div>
  );
};