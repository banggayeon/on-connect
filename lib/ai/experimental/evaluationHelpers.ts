import { analyzeEmotionContextMock } from "./emotionContextAnalyzer";
import { mockEmotionContextScenarios } from "./mockScenarios";
import type { EmotionContextAnalysisInput, EmotionContextAnalysisResult } from "./contextTypes";

export interface MockEmotionEvaluationItem {
  scenarioIndex: number;
  input: EmotionContextAnalysisInput;
  result: EmotionContextAnalysisResult;
}

export interface MockEmotionEvaluationSummary {
  total: number;
  confidenceCounts: Record<EmotionContextAnalysisResult["confidence"], number>;
  strategyCounts: Record<EmotionContextAnalysisResult["recommendedStrategy"]["style"], number>;
  averageGranularityScore: number;
  averageContextRichnessScore: number;
}

export function runMockEmotionEvaluation(
  scenarios: EmotionContextAnalysisInput[] = mockEmotionContextScenarios
): MockEmotionEvaluationItem[] {
  return scenarios.map((input, index) => ({
    scenarioIndex: index + 1,
    input,
    result: analyzeEmotionContextMock(input),
  }));
}

export function summarizeEvaluationResults(
  results: MockEmotionEvaluationItem[]
): MockEmotionEvaluationSummary {
  const confidenceCounts: MockEmotionEvaluationSummary["confidenceCounts"] = {
    low: 0,
    medium: 0,
    high: 0,
  };
  const strategyCounts: MockEmotionEvaluationSummary["strategyCounts"] = {
    light_check: 0,
    warm_acknowledge: 0,
    give_space: 0,
    direct_call: 0,
    apologize_first: 0,
    share_daily_detail: 0,
    ask_back: 0,
  };

  let granularityTotal = 0;
  let richnessTotal = 0;

  for (const item of results) {
    confidenceCounts[item.result.confidence] += 1;
    strategyCounts[item.result.recommendedStrategy.style] += 1;
    granularityTotal += item.result.internalMetrics.granularityScore;
    richnessTotal += item.result.internalMetrics.contextRichnessScore;
  }

  const total = results.length || 1;

  return {
    total: results.length,
    confidenceCounts,
    strategyCounts,
    averageGranularityScore: Math.round(granularityTotal / total),
    averageContextRichnessScore: Math.round(richnessTotal / total),
  };
}

