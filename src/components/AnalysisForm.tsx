import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Github, FolderOpen, Settings, Play, Zap, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { AnalysisConfig } from '@/types/analysis';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [pathType, setPathType] = useState<'github' | 'local'>('github');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isValid, setIsValid] = useState(false);

  // Form validation
  useEffect(() => {
    const errors: { [key: string]: string } = {};
    
    if (!config.repoPath.trim()) {
      errors.repoPath = 'Repository path is required';
    } else if (pathType === 'github' && !config.repoPath.includes('github.com')) {
      errors.repoPath = 'Please enter a valid GitHub URL';
    }
    
    if (!config.scanLibraryImports && !config.scanAlgorithmImplementations) {
      errors.scanOptions = 'At least one scan option must be enabled';
    }

    setFormErrors(errors);
    setIsValid(Object.keys(errors).length === 0);
  }, [config, pathType]);

  const updateConfig = (updates: Partial<AnalysisConfig>) => {
    onConfigChange({ ...config, ...updates });
    
    // Show toast for significant changes
    if (updates.confidenceThreshold || updates.scanLibraryImports !== undefined || updates.scanAlgorithmImplementations !== undefined) {
      toast({
        title: "Configuration Updated",
        description: "Analysis settings have been updated",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onAnalyze();
    } else {
      toast({
        title: "Form Validation Error",
        description: "Please fix the errors before starting analysis",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    onConfigChange({
      repoPath: '',
      scanLibraryImports: true,
      scanAlgorithmImplementations: true,
      confidenceThreshold: 'medium',
      customThreshold: 80
    });
    toast({
      title: "Form Reset",
      description: "All settings have been reset to defaults",
    });
  };

  return (
    <Card className="h-fit sticky top-4 animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Settings className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-lg">Analysis Configuration</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={resetForm}
            className="h-8 w-8 transition-all duration-200 hover:scale-110"
            title="Reset form"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        <CardDescription>
          Configure your cryptographic algorithm analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Repository Input */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Repository Source</Label>
              {formErrors.repoPath && (
                <AlertCircle className="w-4 h-4 text-destructive" />
              )}
              {config.repoPath && !formErrors.repoPath && (
                <CheckCircle2 className="w-4 h-4 text-success" />
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
              <Button
                type="button"
                variant={pathType === 'github' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPathType('github')}
                className="transition-all duration-200 hover:scale-105"
              >
                <Github className="w-4 h-4 mr-1" />
                GitHub
              </Button>
              <Button
                type="button"
                variant={pathType === 'local' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPathType('local')}
                className="transition-all duration-200 hover:scale-105"
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
              className={`w-full transition-all duration-200 ${
                formErrors.repoPath 
                  ? 'border-destructive focus:border-destructive' 
                  : config.repoPath 
                  ? 'border-success focus:border-success' 
                  : ''
              }`}
            />
            {formErrors.repoPath && (
              <p className="text-xs text-destructive animate-fade-in">{formErrors.repoPath}</p>
            )}
          </div>

          <Separator />

          {/* Scan Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Scan Options</Label>
              {formErrors.scanOptions && (
                <AlertCircle className="w-4 h-4 text-destructive" />
              )}
            </div>
            <div className="p-4 bg-muted/30 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Library Imports</Label>
                  <p className="text-xs text-muted-foreground">
                    Scan for cryptographic library imports
                  </p>
                </div>
                <Switch
                  checked={config.scanLibraryImports}
                  onCheckedChange={(checked) => updateConfig({ scanLibraryImports: checked })}
                  className="transition-all duration-200"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Algorithm Implementations</Label>
                  <p className="text-xs text-muted-foreground">
                    Scan for algorithm implementations
                  </p>
                </div>
                <Switch
                  checked={config.scanAlgorithmImplementations}
                  onCheckedChange={(checked) => updateConfig({ scanAlgorithmImplementations: checked })}
                  className="transition-all duration-200"
                />
              </div>
            </div>
            
            {formErrors.scanOptions && (
              <p className="text-xs text-destructive animate-fade-in">{formErrors.scanOptions}</p>
            )}
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
            className={`w-full transition-all duration-300 ${
              isLoading ? 'animate-pulse-glow' : isValid ? 'hover:animate-bounce-subtle' : ''
            }`}
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                {isValid ? <Zap className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isValid ? 'Start Analysis' : 'Complete Configuration'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};