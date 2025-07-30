import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Database } from 'lucide-react';
import { AnalysisResult } from '@/types/analysis';

interface ExportToolsProps {
  result: AnalysisResult;
}

export const ExportTools: React.FC<ExportToolsProps> = ({ result }) => {
  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateSummaryReport = () => {
    const report = {
      analysis_summary: result.summary,
      library_statistics: result.libraryStats,
      algorithm_statistics: result.algorithmStats,
      algorithm_type_statistics: result.algorithmTypeStats,
      total_findings: result.findings.length,
      findings_by_severity: {
        critical: result.findings.filter(f => f.severity === 'critical').length,
        warning: result.findings.filter(f => f.severity === 'warning').length,
        info: result.findings.filter(f => f.severity === 'info').length,
      },
      export_timestamp: new Date().toISOString()
    };
    return JSON.stringify(report, null, 2);
  };

  const generateDetailedReport = () => {
    const report = {
      ...result,
      export_timestamp: new Date().toISOString()
    };
    return JSON.stringify(report, null, 2);
  };

  const generateCSV = () => {
    const headers = [
      'File Path',
      'Algorithm',
      'Algorithm Type',
      'Confidence',
      'Confidence Level',
      'Severity',
      'Line Number',
      'Description'
    ];

    const rows = result.findings.map(finding => [
      finding.filePath,
      finding.algorithm,
      finding.algorithmType,
      finding.confidence.toString(),
      finding.confidenceLevel,
      finding.severity,
      finding.lineNumber.toString(),
      `"${finding.description.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    return csvContent;
  };

  const repoName = result.summary.repositoryName.replace(/[^a-zA-Z0-9]/g, '_');
  const timestamp = new Date().toISOString().split('T')[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Reports
        </CardTitle>
        <CardDescription>
          Download analysis results in various formats
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Summary JSON */}
          <Button
            variant="outline"
            onClick={() => 
              downloadFile(
                generateSummaryReport(),
                `${repoName}_summary_${timestamp}.json`,
                'application/json'
              )
            }
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <FileText className="w-6 h-6" />
            <div className="text-center">
              <div className="font-medium">Summary JSON</div>
              <div className="text-xs text-muted-foreground">
                Overview & statistics
              </div>
            </div>
          </Button>

          {/* Detailed JSON */}
          <Button
            variant="outline"
            onClick={() => 
              downloadFile(
                generateDetailedReport(),
                `${repoName}_detailed_${timestamp}.json`,
                'application/json'
              )
            }
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <Database className="w-6 h-6" />
            <div className="text-center">
              <div className="font-medium">Detailed JSON</div>
              <div className="text-xs text-muted-foreground">
                Complete analysis data
              </div>
            </div>
          </Button>

          {/* CSV Export */}
          <Button
            variant="outline"
            onClick={() => 
              downloadFile(
                generateCSV(),
                `${repoName}_findings_${timestamp}.csv`,
                'text/csv'
              )
            }
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <FileText className="w-6 h-6" />
            <div className="text-center">
              <div className="font-medium">Findings CSV</div>
              <div className="text-xs text-muted-foreground">
                Spreadsheet format
              </div>
            </div>
          </Button>

          {/* Raw Data */}
          <Button
            variant="outline"
            onClick={() => 
              downloadFile(
                result.rawData.json,
                `${repoName}_raw_${timestamp}.json`,
                'application/json'
              )
            }
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <Database className="w-6 h-6" />
            <div className="text-center">
              <div className="font-medium">Raw Data</div>
              <div className="text-xs text-muted-foreground">
                Unprocessed results
              </div>
            </div>
          </Button>
        </div>

        {/* File info */}
        <div className="mt-4 p-3 bg-muted rounded-md">
          <div className="text-sm text-muted-foreground">
            <strong>Export Information:</strong>
            <ul className="mt-1 space-y-1 text-xs">
              <li>• Summary JSON: Overview metrics and statistics ({Math.round(generateSummaryReport().length / 1024)}KB)</li>
              <li>• Detailed JSON: Complete analysis with all findings ({Math.round(generateDetailedReport().length / 1024)}KB)</li>
              <li>• Findings CSV: Tabular data suitable for Excel/Sheets ({Math.round(generateCSV().length / 1024)}KB)</li>
              <li>• Raw Data: Backend response for further processing</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};