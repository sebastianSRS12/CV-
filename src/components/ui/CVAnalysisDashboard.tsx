'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Lightbulb,
  BarChart3,
  Zap
} from 'lucide-react';

interface CVAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

interface AnalysisDashboardProps {
  analysis?: {
    overallScore: number;
    sectionAnalyses: Record<string, CVAnalysis>;
    recommendations: string[];
  };
  context?: {
    industry: string;
    level: string;
    targetRole: string;
  };
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
}

export default function CVAnalysisDashboard({ 
  analysis, 
  context, 
  onRunAnalysis, 
  isAnalyzing 
}: AnalysisDashboardProps) {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30 relative overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10" />
      <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full opacity-10 blur-2xl animate-pulse" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: isAnalyzing ? 360 : 0 }}
              transition={{ duration: 2, repeat: isAnalyzing ? Infinity : 0, ease: "linear" }}
            >
              <Brain className="w-8 h-8 text-purple-400" />
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                AI CV Analysis
              </h3>
              {context && (
                <p className="text-sm text-gray-400">
                  {context.industry} • {context.level} level • {context.targetRole}
                </p>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRunAnalysis}
            disabled={isAnalyzing}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl hover:from-purple-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-purple-500/25 disabled:opacity-50"
          >
            <Zap className="w-5 h-5" />
            <span>{isAnalyzing ? 'Analyzing...' : 'Run Full Analysis'}</span>
          </motion.button>
        </div>

        {analysis ? (
          <>
            {/* Overall Score */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">Overall CV Score</h4>
                <span className={`text-3xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                  {analysis.overallScore}/100
                </span>
              </div>
              
              <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.overallScore}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${getScoreGradient(analysis.overallScore)} rounded-full`}
                />
              </div>
            </div>

            {/* Section Tabs */}
            <div className="flex space-x-2 mb-6 overflow-x-auto">
              {['overview', 'summary', 'experience', 'skills'].map((section) => (
                <motion.button
                  key={section}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveSection(section)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeSection === section
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </motion.button>
              ))}
            </div>

            {/* Content */}
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {activeSection === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(analysis.sectionAnalyses).map(([section, sectionAnalysis]) => (
                    <motion.div
                      key={section}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gray-800/50 rounded-xl p-4 border border-gray-600/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-white capitalize">{section}</h5>
                        <span className={`text-xl font-bold ${getScoreColor(sectionAnalysis.score)}`}>
                          {sectionAnalysis.score}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${sectionAnalysis.score}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className={`h-full bg-gradient-to-r ${getScoreGradient(sectionAnalysis.score)}`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeSection !== 'overview' && analysis.sectionAnalyses[activeSection] && (
                <div className="space-y-6">
                  {/* Strengths */}
                  {analysis.sectionAnalyses[activeSection].strengths.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <h5 className="font-semibold text-green-400">Strengths</h5>
                      </div>
                      <div className="space-y-2">
                        {analysis.sectionAnalyses[activeSection].strengths.map((strength, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-2 text-gray-300"
                          >
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                            <span>{strength}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Weaknesses */}
                  {analysis.sectionAnalyses[activeSection].weaknesses.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <h5 className="font-semibold text-red-400">Areas for Improvement</h5>
                      </div>
                      <div className="space-y-2">
                        {analysis.sectionAnalyses[activeSection].weaknesses.map((weakness, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-2 text-gray-300"
                          >
                            <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                            <span>{weakness}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  {analysis.sectionAnalyses[activeSection].suggestions.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Lightbulb className="w-5 h-5 text-yellow-400" />
                        <h5 className="font-semibold text-yellow-400">AI Suggestions</h5>
                      </div>
                      <div className="space-y-2">
                        {analysis.sectionAnalyses[activeSection].suggestions.map((suggestion, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-2 text-gray-300"
                          >
                            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                            <span>{suggestion}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Top Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div className="mt-8 p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl border border-purple-400/30">
                <div className="flex items-center space-x-2 mb-3">
                  <Target className="w-5 h-5 text-purple-400" />
                  <h5 className="font-semibold text-purple-400">Priority Recommendations</h5>
                </div>
                <div className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-2 text-gray-300"
                    >
                      <TrendingUp className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BarChart3 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            </motion.div>
            <h4 className="text-xl font-semibold text-white mb-2">Ready to Analyze Your CV</h4>
            <p className="text-gray-400 mb-6">
              Get intelligent insights, industry-specific recommendations, and professional scoring
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <span>AI-Powered Analysis</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Target className="w-6 h-6 text-cyan-400" />
                </div>
                <span>Industry Targeting</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <span>Performance Scoring</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Lightbulb className="w-6 h-6 text-yellow-400" />
                </div>
                <span>Smart Suggestions</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
