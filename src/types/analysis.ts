export interface AnalysisConfig {
  repoPath: string;
  scanLibraryImports: boolean;
  scanAlgorithmImplementations: boolean;
  confidenceThreshold: 'low' | 'medium' | 'high' | 'custom';
  customThreshold?: number;
}

export interface SummaryMetrics {
  totalFindings: number;
  filesAnalyzed: number;
  repositoryName: string;
  analysisDate: string;
  scanDuration: string;
}

export interface LibraryStatistic {
  library: string;
  count: number;
  percentage: number;
  confidence: string;
}

export interface AlgorithmStatistic {
  algorithm: string;
  count: number;
  percentage: number;
  averageConfidence: number;
}

export interface AlgorithmTypeStatistic {
  type: string;
  count: number;
  percentage: number;
  algorithms: string[];
}

export interface Finding {
  id: string;
  filePath: string;
  algorithm: string;
  algorithmType: string;
  confidence: number;
  confidenceLevel: 'low' | 'medium' | 'high';
  codeSnippet: string;
  lineNumber: number;
  description: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface AnalysisResult {
  summary: SummaryMetrics;
  libraryStats: LibraryStatistic[];
  algorithmStats: AlgorithmStatistic[];
  algorithmTypeStats: AlgorithmTypeStatistic[];
  findings: Finding[];
  rawData: {
    json: string;
    csv: string;
  };
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: AnalysisResult | null;
  config: AnalysisConfig;
}