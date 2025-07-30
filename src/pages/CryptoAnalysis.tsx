import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AnalysisForm } from '@/components/AnalysisForm';
import { AnalysisResults } from '@/components/AnalysisResults';
import { AnalysisConfig, AnalysisState } from '@/types/analysis';
import { apiService } from '@/services/api';
import { AlertCircle, Shield } from 'lucide-react';

const CryptoAnalysis: React.FC = () => {
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    result: null,
    config: {
      repoPath: '',
      scanLibraryImports: true,
      scanAlgorithmImplementations: true,
      confidenceThreshold: 'medium',
      customThreshold: 80
    }
  });

  const handleConfigChange = (config: AnalysisConfig) => {
    setAnalysisState(prev => ({
      ...prev,
      config,
      error: null
    }));
  };

  const handleAnalyze = async () => {
    setAnalysisState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      result: null
    }));

    try {
      const result = await apiService.analyzeRepository(analysisState.config);
      setAnalysisState(prev => ({
        ...prev,
        isLoading: false,
        result
      }));
    } catch (error) {
      setAnalysisState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Cryptographic Algorithm Analyzer</h1>
              <p className="text-muted-foreground">
                Detect and analyze cryptographic algorithms in your codebase
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Configuration */}
          <div className="lg:col-span-1">
            <AnalysisForm
              config={analysisState.config}
              onConfigChange={handleConfigChange}
              onAnalyze={handleAnalyze}
              isLoading={analysisState.isLoading}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Error Display */}
            {analysisState.error && (
              <Alert className="mb-6 border-destructive/50 bg-destructive/10">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-destructive">
                  {analysisState.error}
                </AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {analysisState.isLoading && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <div className="text-center">
                  <h3 className="text-lg font-medium">Analyzing Repository</h3>
                  <p className="text-muted-foreground">
                    This may take a few minutes depending on repository size...
                  </p>
                </div>
              </div>
            )}

            {/* Results */}
            {analysisState.result && !analysisState.isLoading && (
              <AnalysisResults result={analysisState.result} />
            )}

            {/* Welcome State */}
            {!analysisState.result && !analysisState.isLoading && !analysisState.error && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Shield className="w-12 h-12 text-primary" />
                </div>
                <div className="text-center max-w-md">
                  <h3 className="text-lg font-medium mb-2">Ready to Analyze</h3>
                  <p className="text-muted-foreground">
                    Configure your analysis settings in the sidebar and click "Start Analysis" 
                    to begin scanning your repository for cryptographic algorithms and libraries.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CryptoAnalysis;