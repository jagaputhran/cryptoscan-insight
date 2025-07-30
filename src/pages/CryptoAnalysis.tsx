import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AnalysisForm } from '@/components/AnalysisForm';
import { AnalysisResults } from '@/components/AnalysisResults';
import { AnalysisConfig, AnalysisState } from '@/types/analysis';
import { apiService } from '@/services/api';
import { AlertCircle, Shield, Sparkles, Zap, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CryptoAnalysis: React.FC = () => {
  const { toast } = useToast();
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

    toast({
      title: "Analysis Started",
      description: `Starting analysis of ${analysisState.config.repoPath}...`,
    });

    try {
      const result = await apiService.analyzeRepository(analysisState.config);
      setAnalysisState(prev => ({
        ...prev,
        isLoading: false,
        result
      }));
      
      toast({
        title: "Analysis Complete",
        description: `Found ${result.findings.length} cryptographic algorithms in ${result.summary.filesAnalyzed} files`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setAnalysisState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 animate-pulse-glow">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Cryptographic Algorithm Analyzer
                <Sparkles className="w-5 h-5 text-accent animate-pulse" />
              </h1>
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
              <div className="flex flex-col items-center justify-center py-12 space-y-6 animate-fade-in">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-primary animate-pulse" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium">Analyzing Repository</h3>
                  <p className="text-muted-foreground max-w-md">
                    Scanning files for cryptographic algorithms and libraries. 
                    This may take a few minutes depending on repository size...
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {analysisState.result && !analysisState.isLoading && (
              <div className="animate-fade-in">
                <AnalysisResults result={analysisState.result} />
              </div>
            )}

            {/* Welcome State */}
            {!analysisState.result && !analysisState.isLoading && !analysisState.error && (
              <div className="flex flex-col items-center justify-center py-12 space-y-6 animate-fade-in">
                <div className="relative">
                  <div className="p-6 rounded-full bg-primary/10 animate-pulse">
                    <Shield className="w-16 h-16 text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <Zap className="w-6 h-6 text-accent animate-bounce" />
                  </div>
                </div>
                <div className="text-center max-w-md space-y-3">
                  <h3 className="text-xl font-semibold">Ready to Analyze</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Configure your analysis settings in the sidebar and click "Start Analysis" 
                    to begin scanning your repository for cryptographic algorithms and libraries.
                  </p>
                  <div className="flex items-center justify-center gap-4 pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      <span>Secure Analysis</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Zap className="w-4 h-4" />
                      <span>Fast Results</span>
                    </div>
                  </div>
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