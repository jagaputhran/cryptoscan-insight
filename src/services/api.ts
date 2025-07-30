import axios from 'axios';
import { AnalysisConfig, AnalysisResult } from '@/types/analysis';

// Configure your backend API URL here
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes for long analysis tasks
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data generator for demo purposes
const generateMockData = (config: AnalysisConfig): AnalysisResult => {
  const algorithms = [
    'AES', 'RSA', 'SHA-256', 'MD5', 'DES', 'Blowfish', 'ECC', 'HMAC',
    'PBKDF2', 'Scrypt', 'ChaCha20', 'Poly1305', 'X25519', 'Ed25519'
  ];
  
  const algorithmTypes = [
    'Symmetric Encryption', 'Asymmetric Encryption', 'Hash Function', 
    'Key Derivation', 'Digital Signature', 'Message Authentication'
  ];
  
  const libraries = [
    'cryptography', 'pycryptodome', 'hashlib', 'secrets', 'ssl',
    'jwt', 'bcrypt', 'argon2', 'nacl', 'cryptojs'
  ];

  const repoName = config.repoPath.split('/').pop() || 'unknown-repo';
  
  const findingsCount = Math.floor(Math.random() * 50) + 10;
  const filesCount = Math.floor(Math.random() * 100) + 20;
  
  // Generate findings
  const findings = Array.from({ length: findingsCount }, (_, i) => {
    const algorithm = algorithms[Math.floor(Math.random() * algorithms.length)];
    const algorithmType = algorithmTypes[Math.floor(Math.random() * algorithmTypes.length)];
    const confidence = Math.floor(Math.random() * 40) + 60;
    const severity = confidence >= 90 ? 'critical' : confidence >= 75 ? 'warning' : 'info';
    
    return {
      id: `finding-${i}`,
      filePath: `src/${['utils', 'crypto', 'auth', 'security'][Math.floor(Math.random() * 4)]}/${algorithm.toLowerCase()}_${Math.floor(Math.random() * 10)}.py`,
      algorithm,
      algorithmType,
      confidence,
      confidenceLevel: (confidence >= 90 ? 'high' : confidence >= 75 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
      codeSnippet: `def ${algorithm.toLowerCase()}_encrypt(data, key):\n    cipher = ${algorithm}(key)\n    return cipher.encrypt(data)`,
      lineNumber: Math.floor(Math.random() * 200) + 1,
      description: `${algorithmType} implementation using ${algorithm} algorithm detected`,
      severity: severity as 'info' | 'warning' | 'critical'
    };
  });

  // Generate statistics
  const libraryStats = libraries.map(lib => ({
    library: lib,
    count: Math.floor(Math.random() * 15) + 1,
    percentage: Math.floor(Math.random() * 25) + 5,
    confidence: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)]
  }));

  const algorithmStats = algorithms.map(alg => ({
    algorithm: alg,
    count: Math.floor(Math.random() * 10) + 1,
    percentage: Math.floor(Math.random() * 20) + 5,
    averageConfidence: Math.floor(Math.random() * 30) + 70
  }));

  const algorithmTypeStats = algorithmTypes.map(type => ({
    type,
    count: Math.floor(Math.random() * 8) + 2,
    percentage: Math.floor(Math.random() * 25) + 10,
    algorithms: algorithms.slice(0, Math.floor(Math.random() * 4) + 2)
  }));

  const summary = {
    totalFindings: findingsCount,
    filesAnalyzed: filesCount,
    repositoryName: repoName,
    analysisDate: new Date().toISOString(),
    scanDuration: `${Math.floor(Math.random() * 5) + 1}m ${Math.floor(Math.random() * 60)}s`
  };

  return {
    summary,
    libraryStats,
    algorithmStats,
    algorithmTypeStats,
    findings,
    rawData: {
      json: JSON.stringify({ summary, findings, libraryStats, algorithmStats }, null, 2),
      csv: [
        'File Path,Algorithm,Algorithm Type,Confidence,Severity,Line Number,Description',
        ...findings.map(f => 
          `"${f.filePath}","${f.algorithm}","${f.algorithmType}",${f.confidence},"${f.severity}",${f.lineNumber},"${f.description}"`
        )
      ].join('\n')
    }
  };
};

export const apiService = {
  // Main analysis endpoint
  async analyzeRepository(config: AnalysisConfig): Promise<AnalysisResult> {
    try {
      // For demo purposes, use mock data
      // In production, replace with actual API call:
      // const response = await api.post('/analyze', config);
      // return response.data;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      return generateMockData(config);
    } catch (error) {
      console.error('Analysis failed:', error);
      throw new Error('Failed to analyze repository. Please check your configuration and try again.');
    }
  },

  // Health check endpoint
  async healthCheck(): Promise<boolean> {
    try {
      // const response = await api.get('/health');
      // return response.status === 200;
      return true; // Mock response
    } catch (error) {
      return false;
    }
  },

  // Get analysis status (for long-running analyses)
  async getAnalysisStatus(analysisId: string): Promise<{ status: string; progress: number }> {
    try {
      // const response = await api.get(`/analysis/${analysisId}/status`);
      // return response.data;
      return { status: 'completed', progress: 100 }; // Mock response
    } catch (error) {
      throw new Error('Failed to get analysis status');
    }
  }
};

// Example Python backend endpoints needed:

/*
Python Flask/FastAPI Backend Endpoints:

1. POST /analyze
   - Accepts: { repoPath, scanLibraryImports, scanAlgorithmImplementations, confidenceThreshold }
   - Returns: AnalysisResult
   
2. GET /health
   - Returns: { status: "ok" }
   
3. GET /analysis/{id}/status
   - Returns: { status: "running|completed|failed", progress: 0-100 }

4. POST /analyze/async
   - Starts background analysis
   - Returns: { analysisId: string }

Example Python implementation:

```python
from flask import Flask, request, jsonify
from your_analysis_module import analyze_repo

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    
    repo_path = data.get('repoPath')
    options = {
        'scan_library_imports': data.get('scanLibraryImports', True),
        'scan_algorithm_implementations': data.get('scanAlgorithmImplementations', True),
        'confidence_threshold': data.get('confidenceThreshold', 'medium')
    }
    
    try:
        result = analyze_repo(repo_path, options)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})
```
*/