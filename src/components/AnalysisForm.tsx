import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Github, FolderOpen, Settings, Play } from 'lucide-react';
import { AnalysisConfig } from '@/types/analysis';

interface AnalysisFormProps {
  config: AnalysisConfig;
  onConfigChange: (config: AnalysisConfig) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const AnalysisForm: React.FC<AnalysisFormProps> = ({
  config,
  onConfigChange,
  onAnalyze,
  isLoading
}) => {
  const [pathType, setPathType] = useState<'github' | 'local'>('github');

  const updateConfig = (updates: Partial<AnalysisConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze();
  };

  return (
    <Card className="h-fit sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Analysis Configuration
        </CardTitle>
        <CardDescription>
          Configure your cryptographic algorithm analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Repository Input */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Repository Source</Label>
            <div className="flex gap-2 mb-3">
              <Button
                type="button"
                variant={pathType === 'github' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPathType('github')}
                className="flex-1"
              >
                <Github className="w-4 h-4 mr-1" />
                GitHub
              </Button>
              <Button
                type="button"
                variant={pathType === 'local' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPathType('local')}
                className="flex-1"
              >
                <FolderOpen className="w-4 h-4 mr-1" />
                Local
              </Button>
            </div>
            
            <Input
              placeholder={
                pathType === 'github' 
                  ? 'https://github.com/user/repository'
                  : '/path/to/local/repository'
              }
              value={config.repoPath}
              onChange={(e) => updateConfig({ repoPath: e.target.value })}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Scan Options */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Scan Options</Label>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Library Imports</Label>
                <p className="text-xs text-muted-foreground">
                  Scan for cryptographic library imports
                </p>
              </div>
              <Switch
                checked={config.scanLibraryImports}
                onCheckedChange={(checked) => updateConfig({ scanLibraryImports: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Algorithm Implementations</Label>
                <p className="text-xs text-muted-foreground">
                  Scan for algorithm implementations
                </p>
              </div>
              <Switch
                checked={config.scanAlgorithmImplementations}
                onCheckedChange={(checked) => updateConfig({ scanAlgorithmImplementations: checked })}
              />
            </div>
          </div>

          <Separator />

          {/* Confidence Threshold */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Confidence Threshold</Label>
            
            <Select
              value={config.confidenceThreshold}
              onValueChange={(value: AnalysisConfig['confidenceThreshold']) => 
                updateConfig({ confidenceThreshold: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (60%+)</SelectItem>
                <SelectItem value="medium">Medium (75%+)</SelectItem>
                <SelectItem value="high">High (90%+)</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>

            {config.confidenceThreshold === 'custom' && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs">Custom Threshold</Label>
                  <span className="text-xs text-muted-foreground">
                    {config.customThreshold || 80}%
                  </span>
                </div>
                <Slider
                  value={[config.customThreshold || 80]}
                  onValueChange={([value]) => updateConfig({ customThreshold: value })}
                  min={50}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Analyze Button */}
          <Button 
            type="submit" 
            variant="analysis" 
            className="w-full" 
            disabled={!config.repoPath || isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Analysis
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};