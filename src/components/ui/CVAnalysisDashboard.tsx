'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  BarChart3,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Lightbulb,
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
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              CV Analysis
            </h3>
            {context && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {context.industry} • {context.level} level • {context.targetRole}
              </p>
            )}
          </div>

          <button
            onClick={onRunAnalysis}
            disabled={isAnalyzing}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-md transition-colors duration-200 disabled:cursor-not-allowed"
            aria-label="Run CV analysis"
          >
            <BarChart3 className="w-4 h-4" />
            <span>{isAnalyzing ? 'Analyzing...' : 'Run Analysis'}</span>
          </button>
        </div>

        {analysis ? (
          <>
            {/* Overall Score */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">Overall Score</h4>
                <span className={`text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                  {analysis.overallScore}/100
                </span>
              </div>

              <div className="relative h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.overallScore}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full ${getScoreBg(analysis.overallScore)} rounded-full`}
                />
              </div>
            </div>

            {/* Section Tabs */}
            <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-700">
              {['overview', 'summary', 'experience', 'skills'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-4 py-2 text-sm font-medium transition-colors capitalize ${
                    activeSection === section
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  {section}
                </button>
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
                    <div
                      key={section}
                      className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900 dark:text-white capitalize">{section}</h5>
                        <span className={`text-lg font-bold ${getScoreColor(sectionAnalysis.score)}`}>
                          {sectionAnalysis.score}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${sectionAnalysis.score}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className={`h-full ${getScoreBg(sectionAnalysis.score)} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeSection !== 'overview' && analysis.sectionAnalyses[activeSection] && (
                <div className="space-y-6">
                  {/* Strengths */}
                  {analysis.sectionAnalyses[activeSection].strengths.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h5 className="font-semibold text-green-600">Strengths</h5>
                      </div>
                      <ul className="space-y-2">
                        {analysis.sectionAnalyses[activeSection].strengths.map((strength, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-2 text-gray-700 dark:text-gray-300"
                          >
                            <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                            <span>{strength}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Weaknesses */}
                  {analysis.sectionAnalyses[activeSection].weaknesses.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <h5 className="font-semibold text-red-600">Areas for Improvement</h5>
                      </div>
                      <ul className="space-y-2">
                        {analysis.sectionAnalyses[activeSection].weaknesses.map((weakness, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-2 text-gray-700 dark:text-gray-300"
                          >
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                            <span>{weakness}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggestions */}
                  {analysis.sectionAnalyses[activeSection].suggestions.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        <h5 className="font-semibold text-yellow-600">Suggestions</h5>
                      </div>
                      <ul className="space-y-2">
                        {analysis.sectionAnalyses[activeSection].suggestions.map((suggestion, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-2 text-gray-700 dark:text-gray-300"
                          >
                            <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                            <span>{suggestion}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Top Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h5 className="font-semibold text-blue-600">Priority Recommendations</h5>
                </div>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-2 text-gray-700 dark:text-gray-300"
                    >
                      <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Ready to Analyze Your CV</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Get detailed insights and recommendations to improve your CV
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}