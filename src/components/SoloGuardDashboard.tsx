import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Code, GitBranch, Zap, Eye, Download, RefreshCw, Search, Settings, TrendingUp, Activity, Target, Award } from 'lucide-react';
import { LoadingSpinner, ScoreBadge, ProgressBar, StatCard } from './SoloGuardUIComponents';

interface SoloGuardAnalysis {
  score: number;
  hallucinations: string[];
  risks: string[];
  reasoning: string;
  diff_summary: {
    added: number;
    removed: number;
    modified: number;
  };
  low_confidence_lines: number[];
  safe_patch: string;
  raw_diff: string;
}

interface AnalysisResult {
  success: boolean;
  data: SoloGuardAnalysis | null;
  testName?: string;
  error?: string;
}

interface TestCase {
  name: string;
  oldCode: string;
  newCode: string;
  category: 'security' | 'hallucination' | 'risk' | 'mixed';
  description: string;
}

const SoloGuardDashboard: React.FC = () => {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([
    {
      success: true,
      data: {
        score: 96,
        hallucinations: ["Missing variable or function: world"],
        risks: [],
        reasoning: "Compared 1→2 lines (Δ 1). Risks: none. Hallucinations: Missing variable or function: world.",
        diff_summary: { added: 2, removed: 1, modified: 1 },
        low_confidence_lines: [1, 2],
        safe_patch: "console.log(\"hello\");\nconsole.log(\"world\");",
        raw_diff: "================================================================================\n--- old\n+++ new\n@@ -1,1 +1,2 @@\n-console.log(\"hello\");\n\\ No newline at end of file\n+console.log(\"hello\");\n+console.log(\"world\");\n\\ No newline at end of file"
      },
      testName: "Clean Code Addition"
    },
    {
      success: true,
      data: {
        score: 96,
        hallucinations: ["Missing variable or function: undefinedVariable"],
        risks: [],
        reasoning: "Compared 1→1 lines (Δ 0). Risks: none. Hallucinations: Missing variable or function: undefinedVariable.",
        diff_summary: { added: 1, removed: 1, modified: 1 },
        low_confidence_lines: [1],
        safe_patch: "function test() { return undefinedVariable; }",
        raw_diff: "================================================================================\n--- old\n+++ new\n@@ -1,1 +1,1 @@\n-function test() { return 1; }\n\\ No newline at end of file\n+function test() { return undefinedVariable; }\n\\ No newline at end of file"
      },
      testName: "Missing Variable Reference"
    },
    {
      success: true,
      data: {
        score: 78,
        hallucinations: [],
        risks: ["Removed error-handling blocks", "Dangerous deletions detected"],
        reasoning: "Compared 1→1 lines (Δ 0). Risks: Removed error-handling blocks; Dangerous deletions detected. Hallucinations: none.",
        diff_summary: { added: 1, removed: 1, modified: 1 },
        low_confidence_lines: [1],
        safe_patch: "riskyOperation();\ntry { riskyOperation(); } catch(e) { console.error(e); }",
        raw_diff: "================================================================================\n--- old\n+++ new\n@@ -1,1 +1,1 @@\n-try { riskyOperation(); } catch(e) { console.error(e); }\n\\ No newline at end of file\n+riskyOperation();\n\\ No newline at end of file"
      },
      testName: "Removed Error Handling"
    },
    {
      success: true,
      data: {
        score: 72,
        hallucinations: ["Missing variable or function: openai", "Missing variable or function: chat", "Missing variable or function: completions", "Missing variable or function: create", "Missing variable or function: model", "Missing variable or function: gpt", "AI API usage without proper import"],
        risks: [],
        reasoning: "Compared 1→1 lines (Δ 0). Risks: none. Hallucinations: Missing variable or function: openai; Missing variable or function: chat; Missing variable or function: completions; Missing variable or function: create; Missing variable or function: model; Missing variable or function: gpt; AI API usage without proper import.",
        diff_summary: { added: 1, removed: 1, modified: 1 },
        low_confidence_lines: [1],
        safe_patch: "const response = await openai.chat.completions.create({ model: \"gpt-4\" });",
        raw_diff: "================================================================================\n--- old\n+++ new\n@@ -1,1 +1,1 @@\n-console.log(\"test\");\n\\ No newline at end of file\n+const response = await openai.chat.completions.create({ model: \"gpt-4\" });\n\\ No newline at end of file"
      },
      testName: "AI API Without Import"
    },
    {
      success: true,
      data: {
        score: 70,
        hallucinations: ["Missing variable or function: http", "Missing variable or function: external", "Missing variable or function: site", "Missing variable or function: com", "Missing variable or function: js", "Unsupported import source: http://external-site.com/utils.js"],
        risks: ["Unused import: helper"],
        reasoning: "Compared 1→1 lines (Δ 0). Risks: Unused import: helper. Hallucinations: Missing variable or function: http; Missing variable or function: external; Missing variable or function: site; Missing variable or function: com; Missing variable or function: js; Unsupported import source: http://external-site.com/utils.js.",
        diff_summary: { added: 1, removed: 1, modified: 1 },
        low_confidence_lines: [1],
        safe_patch: "import { helper } from \"http://external-site.com/utils.js\";",
        raw_diff: "================================================================================\n--- old\n+++ new\n@@ -1,1 +1,1 @@\n-import { helper } from \"./utils\";\n\\ No newline at end of file\n+import { helper } from \"http://external-site.com/utils.js\";\n\\ No newline at end of file"
      },
      testName: "External HTTP Import"
    },
    {
      success: true,
      data: {
        score: 78,
        hallucinations: [],
        risks: ["Removed error-handling blocks", "Dangerous deletions detected"],
        reasoning: "Compared 11→3 lines (Δ -8). Risks: Removed error-handling blocks; Dangerous deletions detected. Hallucinations: none.",
        diff_summary: { added: 1, removed: 9, modified: 1 },
        low_confidence_lines: [2],
        safe_patch: "function processUser(data) {\n  return data.name.toUpperCase();\n}\n  try {\n    if (!data.name) throw new Error(\"Name required\");\n    validateInput(data.name);\n    sanitizeInput(data.name);\n  } catch (error) {\n    console.error(\":\", error);",
        raw_diff: "================================================================================\n--- old\n+++ new\n@@ -1,11 +1,3 @@\n function processUser(data) {\n-  try {\n-    if (!data.name) throw new Error(\"Name required\");\n-    validateInput(data.name);\n-    sanitizeInput(data.name);\n-    return data.name.toUpperCase();\n-  } catch (error) {\n-    console.error(\":\", error);\n-    return null;\n-  }\n+  return data.name.toUpperCase();\n }\n\\ No newline at end of file"
      },
      testName: "Complex Change with Multiple Issues"
    }
  ]);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(analysisResults[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'timestamp' | 'name'>('timestamp');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Enhanced test cases with categories and descriptions
  const testCases: TestCase[] = [
    {
      name: "Clean Code Addition",
      oldCode: "console.log('hello');",
      newCode: "console.log('hello');\nconsole.log('world');",
      category: 'security',
      description: "Simple code addition with no issues"
    },
    {
      name: "Missing Variable Reference",
      oldCode: "function test() { return 1; }",
      newCode: "function test() { return undefinedVariable; }",
      category: 'hallucination',
      description: "References undefined variable"
    },
    {
      name: "Removed Error Handling",
      oldCode: "try { riskyOperation(); } catch(e) { console.error(e); }",
      newCode: "riskyOperation();",
      category: 'risk',
      description: "Removes critical error handling"
    },
    {
      name: "AI API Without Import",
      oldCode: "console.log('test');",
      newCode: "const response = await openai.chat.completions.create({ model: 'gpt-4' });",
      category: 'hallucination',
      description: "Uses AI API without proper import"
    },
    {
      name: "External HTTP Import",
      oldCode: "import { helper } from './utils';",
      newCode: "import { helper } from 'http://external-site.com/utils.js';",
      category: 'security',
      description: "Imports from external HTTP source"
    },
    {
      name: "Complex Change with Multiple Issues",
      oldCode: `function processUser(data) {
  try {
    if (!data.name) throw new Error('Name required');
    validateInput(data.name);
    sanitizeInput(data.name);
    return data.name.toUpperCase();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}`,
      newCode: `function processUser(data) {
  return data.name.toUpperCase();
}`,
      category: 'mixed',
      description: "Multiple security and validation issues"
    }
  ];

  const runAnalysis = async (oldCode: string, newCode: string, testName: string) => {
    setIsAnalyzing(true);
    setCurrentTest(testName);
    
    try {
      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldCode, newCode }),
      });

      const result: AnalysisResult = await response.json();
      setAnalysisResults(prev => [...prev, { ...result, testName }]);
      
      if (result.success && result.data) {
        setSelectedResult(result);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisResults(prev => [...prev, { 
        success: false, 
        data: null,
        testName,
        error: 'Analysis failed'
      }]);
    }
    
    setIsAnalyzing(false);
    setCurrentTest('');
  };

  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 shadow-2xl">
        <LoadingSpinner 
          size="lg" 
          text={`Analyzing: ${currentTest}`}
        />
      </div>
    </div>
  );

  const runAllTests = async () => {
    for (const testCase of testCases) {
      await runAnalysis(testCase.oldCode, testCase.newCode, testCase.name);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const clearResults = () => {
    setAnalysisResults([]);
    setSelectedResult(null);
  };

  const exportResults = () => {
    const dataStr = JSON.stringify(analysisResults, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `sologuard-analysis-${new Date().toISOString()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    if (score >= 50) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return <Shield className="w-4 h-4" />;
      case 'hallucination': return <Eye className="w-4 h-4" />;
      case 'risk': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'security': return 'bg-red-100 text-red-800 border-red-200';
      case 'hallucination': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'risk': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredResults = analysisResults.filter(result => {
    const matchesSearch = result.testName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || 
      testCases.find(tc => tc.name === result.testName)?.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return (b.data?.score || 0) - (a.data?.score || 0);
      case 'name':
        return (a.testName || '').localeCompare(b.testName || '');
      default:
        return 0; // timestamp - keep original order
    }
  });

  const SoloGuardHeader = () => (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 mb-8 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="w-8 h-8" />
            <h1 className="text-3xl font-bold">SoloGuard AI</h1>
          </div>
          <p className="text-blue-100 text-lg">Advanced Code Analysis & Security Detection</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{analysisResults.length}</div>
            <div className="text-blue-100 text-sm">Analyses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {analysisResults.length > 0 ? Math.round(analysisResults.reduce((acc, r) => acc + (r.data?.score || 0), 0) / analysisResults.length) : 0}
            </div>
            <div className="text-blue-100 text-sm">Avg Score</div>
          </div>
        </div>
      </div>
    </div>
  );

  const SoloGuardExplanation = () => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <Target className="w-5 h-5 mr-2 text-blue-600" />
        How SoloGuard Works
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Shield className="w-5 h-5 text-red-600 mr-2" />
            <h4 className="font-semibold text-red-900">Security Detection</h4>
          </div>
          <ul className="text-sm text-red-800 space-y-1">
            <li>• External HTTP imports</li>
            <li>• Unsafe code patterns</li>
            <li>• Permission bypass attempts</li>
            <li>• Malicious code injection</li>
          </ul>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Eye className="w-5 h-5 text-purple-600 mr-2" />
            <h4 className="font-semibold text-purple-900">Hallucination Detection</h4>
          </div>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Undefined variables/functions</li>
            <li>• Missing imports</li>
            <li>• AI API usage without imports</li>
            <li>• Non-existent references</li>
          </ul>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            <h4 className="font-semibold text-yellow-900">Risk Assessment</h4>
          </div>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Error handling removal</li>
            <li>• Unused imports</li>
            <li>• Dangerous deletions</li>
            <li>• Performance impacts</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const TestControls = () => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-blue-600" />
          Test Controls
        </h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={clearResults}
            className="px-4 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors flex items-center"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Clear
          </button>
          <button
            onClick={exportResults}
            className="px-4 py-2 text-green-600 hover:bg-green-50 border border-green-200 rounded-lg transition-colors flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button
            onClick={runAllTests}
            disabled={isAnalyzing}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium flex items-center transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing...' : 'Run All Tests'}
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'score' | 'timestamp' | 'name')}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="timestamp">Timestamp</option>
                <option value="score">Score</option>
                <option value="name">Name</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm rounded-md ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm rounded-md ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  List
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Auto-refresh</span>
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testCases.map((testCase, index) => (
          <button
            key={index}
            onClick={() => runAnalysis(testCase.oldCode, testCase.newCode, testCase.name)}
            disabled={isAnalyzing}
            className={`text-left p-4 border rounded-lg hover:shadow-md transition-all duration-200 ${
              currentTest === testCase.name 
                ? 'border-blue-500 bg-blue-50 shadow-lg' 
                : 'border-gray-200 hover:border-gray-300'
            } disabled:opacity-50`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-gray-900">{testCase.name}</div>
              <div className={`flex items-center px-2 py-1 rounded-full text-xs border ${getCategoryColor(testCase.category)}`}>
                {getCategoryIcon(testCase.category)}
                <span className="ml-1 capitalize">{testCase.category}</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-2">{testCase.description}</div>
            <div className="text-xs text-gray-500">
              {testCase.oldCode.split('\n').length} → {testCase.newCode.split('\n').length} lines
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const ResultsSummary = () => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Analysis Results
        </h3>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search results..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="security">Security</option>
            <option value="hallucination">Hallucination</option>
            <option value="risk">Risk</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
      </div>

      {sortedResults.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
          <p className="text-gray-500">Run some tests to see analysis results here.</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
          {sortedResults.map((result, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition-all duration-200 ${
                selectedResult === result ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedResult(result)}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-900">{result.testName || `Test ${index + 1}`}</span>
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreBackground(result.data?.score || 0)} ${getScoreColor(result.data?.score || 0)}`}>
                  {result.data?.score || 0}/100
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-1 text-purple-600" />
                    Hallucinations: {result.data?.hallucinations.length || 0}
                  </span>
                  <span className="flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1 text-yellow-600" />
                    Risks: {result.data?.risks.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>+{result.data?.diff_summary.added || 0} / -{result.data?.diff_summary.removed || 0}</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const AnalysisDetails = ({ result }: { result: AnalysisResult }) => {
    if (!result.data) return null;

    const { data } = result;

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
            <Award className="w-6 h-6 mr-3 text-blue-600" />
            Detailed Analysis Results
          </h3>
          <div className={`px-4 py-2 rounded-full text-xl font-bold ${getScoreBackground(data.score)} ${getScoreColor(data.score)}`}>
            Score: {data.score}/100
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Hallucinations */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-5">
            <div className="flex items-center mb-4">
              <Eye className="w-5 h-5 text-red-600 mr-2" />
              <h4 className="font-semibold text-red-900">🎭 Hallucinations ({data.hallucinations.length})</h4>
            </div>
            {data.hallucinations.length > 0 ? (
              <div className="space-y-3">
                {data.hallucinations.map((hallucination, index) => (
                  <div key={index} className="bg-red-100 border border-red-200 rounded-lg p-3">
                    <div className="text-red-800 text-sm">{hallucination}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-green-100 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  No hallucinations detected
                </p>
              </div>
            )}
          </div>

          {/* Risks */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              <h4 className="font-semibold text-yellow-900">⚠️ Risks ({data.risks.length})</h4>
            </div>
            {data.risks.length > 0 ? (
              <div className="space-y-3">
                {data.risks.map((risk, index) => (
                  <div key={index} className="bg-yellow-100 border border-yellow-200 rounded-lg p-3">
                    <div className="text-yellow-800 text-sm">{risk}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-green-100 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  No risks detected
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Diff Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <GitBranch className="w-5 h-5 mr-2" />
            📊 Code Changes Summary
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-100 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-green-800 font-bold text-xl">+{data.diff_summary.added}</div>
              <div className="text-green-600 text-sm">Lines Added</div>
            </div>
            <div className="bg-red-100 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-red-800 font-bold text-xl">-{data.diff_summary.removed}</div>
              <div className="text-red-600 text-sm">Lines Removed</div>
            </div>
            <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-blue-800 font-bold text-xl">~{data.diff_summary.modified}</div>
              <div className="text-blue-600 text-sm">Lines Modified</div>
            </div>
          </div>
        </div>

        {/* Reasoning */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            🧠 AI Reasoning
          </h4>
          <p className="text-blue-800 text-sm leading-relaxed">{data.reasoning}</p>
        </div>

        {/* Safe Patch */}
        {data.safe_patch !== data.raw_diff && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-5 mb-6">
            <h4 className="font-semibold text-green-900 mb-3 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              🔧 Safe Patch Applied
            </h4>
            <pre className="text-green-800 text-xs bg-green-100 p-4 rounded-lg overflow-x-auto border border-green-200">
              {data.safe_patch}
            </pre>
          </div>
        )}

        {/* Raw Diff */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Code className="w-5 h-5 mr-2" />
            📋 Raw Diff
          </h4>
          <pre className="text-gray-700 text-xs bg-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-200">
            {data.raw_diff}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {isAnalyzing && <LoadingOverlay />}
      
      <div className="max-w-7xl mx-auto">
        <SoloGuardHeader />
        <SoloGuardExplanation />
        <TestControls />
        
        {/* Always show results summary */}
        <ResultsSummary />
        
        {/* Show detailed analysis for the first result by default */}
        {selectedResult && <AnalysisDetails result={selectedResult} />}

        {/* Always show stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Analyses"
            value={analysisResults.length}
            icon={<Activity className="w-5 h-5" />}
            trend="up"
            trendValue="+100%"
          />
          <StatCard
            title="Average Score"
            value={analysisResults.length > 0 ? Math.round(analysisResults.reduce((acc, r) => acc + (r.data?.score || 0), 0) / analysisResults.length) : 0}
            icon={<Award className="w-5 h-5" />}
            trend="neutral"
            trendValue="Current"
          />
          <StatCard
            title="Total Issues"
            value={analysisResults.reduce((acc, r) => acc + (r.data?.hallucinations.length || 0) + (r.data?.risks.length || 0), 0)}
            icon={<AlertTriangle className="w-5 h-5" />}
            trend="down"
            trendValue="-15%"
          />
          <StatCard
            title="Safe Patches"
            value={analysisResults.filter(r => r.data && r.data.safe_patch !== r.data.raw_diff).length}
            icon={<CheckCircle className="w-5 h-5" />}
            trend="up"
            trendValue="+25%"
          />
        </div>

        {/* Quick Summary of All Results */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-600" />
            📋 Analysis Summary
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hallucinations Summary */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
              <div className="flex items-center mb-4">
                <Eye className="w-5 h-5 text-purple-600 mr-2" />
                <h4 className="font-semibold text-purple-900">🎭 All Hallucinations</h4>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {analysisResults.flatMap(result => 
                  result.data?.hallucinations.map((hallucination, idx) => (
                    <div key={`${result.testName}-${idx}`} className="bg-purple-100 border border-purple-200 rounded-lg p-3">
                      <div className="text-purple-800 text-sm font-medium mb-1">{result.testName}</div>
                      <div className="text-purple-700 text-xs">{hallucination}</div>
                    </div>
                  ))
                ).length > 0 ? (
                  analysisResults.flatMap(result => 
                    result.data?.hallucinations.map((hallucination, idx) => (
                      <div key={`${result.testName}-${idx}`} className="bg-purple-100 border border-purple-200 rounded-lg p-3">
                        <div className="text-purple-800 text-sm font-medium mb-1">{result.testName}</div>
                        <div className="text-purple-700 text-xs">{hallucination}</div>
                      </div>
                    ))
                  )
                ) : (
                  <div className="bg-green-100 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      No hallucinations detected across all tests
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Risks Summary */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                <h4 className="font-semibold text-yellow-900">⚠️ All Risks</h4>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {analysisResults.flatMap(result => 
                  result.data?.risks.map((risk, idx) => (
                    <div key={`${result.testName}-${idx}`} className="bg-yellow-100 border border-yellow-200 rounded-lg p-3">
                      <div className="text-yellow-800 text-sm font-medium mb-1">{result.testName}</div>
                      <div className="text-yellow-700 text-xs">{risk}</div>
                    </div>
                  ))
                ).length > 0 ? (
                  analysisResults.flatMap(result => 
                    result.data?.risks.map((risk, idx) => (
                      <div key={`${result.testName}-${idx}`} className="bg-yellow-100 border border-yellow-200 rounded-lg p-3">
                        <div className="text-yellow-800 text-sm font-medium mb-1">{result.testName}</div>
                        <div className="text-yellow-700 text-xs">{risk}</div>
                      </div>
                    ))
                  )
                ) : (
                  <div className="bg-green-100 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      No risks detected across all tests
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scoring Algorithm */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-600" />
            📊 Scoring Algorithm
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Scoring Factors</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Base Score:</span>
                  <span className="font-medium text-sm">100 points</span>
                </div>
                <ProgressBar value={100} max={100} color="blue" showLabel />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Churn Penalty:</span>
                  <span className="font-medium text-sm">-1 per 20 lines (max -30)</span>
                </div>
                <ProgressBar value={30} max={100} color="yellow" showLabel />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Risk Penalty:</span>
                  <span className="font-medium text-sm">-6 per risk (max -40)</span>
                </div>
                <ProgressBar value={40} max={100} color="red" showLabel />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Hallucination Penalty:</span>
                  <span className="font-medium text-sm">-4 per hallucination (max -30)</span>
                </div>
                <ProgressBar value={30} max={100} color="purple" showLabel />
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Score Ranges</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">Excellent</span>
                  </div>
                  <ScoreBadge score={95} size="sm" />
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-100 rounded-lg border border-yellow-200">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">Good</span>
                  </div>
                  <ScoreBadge score={80} size="sm" />
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-100 rounded-lg border border-orange-200">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">Fair</span>
                  </div>
                  <ScoreBadge score={60} size="sm" />
                </div>
                <div className="flex items-center justify-between p-3 bg-red-100 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">Poor</span>
                  </div>
                  <ScoreBadge score={25} size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoloGuardDashboard;