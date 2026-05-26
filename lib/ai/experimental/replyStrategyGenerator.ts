import type {
  EmotionContextAnalysisInput,
  EmotionContextAnalysisResult,
  ReplyStrategy,
  ReplyTone,
  WarmReplyOption,
} from "./contextTypes";

const strategyLabels: Record<ReplyStrategy, string> = {
  light_check: "가볍게 확인",
  warm_acknowledge: "따뜻하게 받기",
  give_space: "여지 남기기",
  direct_call: "통화 제안",
  apologize_first: "먼저 사과",
  share_daily_detail: "일상 공유",
  ask_back: "되묻기",
};

function getReceiverName(input: EmotionContextAnalysisInput) {
  if (input.receiverRole === "parent") {
    return input.receiverName ?? "엄마";
  }
  return input.receiverName ?? "너";
}

function makeOption(
  text: string,
  tone: ReplyTone,
  strategy: ReplyStrategy,
  expressedSignals: string[],
  reason: string
): WarmReplyOption {
  return {
    text,
    tone,
    strategy,
    expressedSignals,
    reason,
    displayLabel: strategyLabels[strategy],
  };
}

function uniqueOptions(options: WarmReplyOption[]) {
  const seen = new Set<string>();
  return options.filter((option) => {
    if (seen.has(option.text)) return false;
    seen.add(option.text);
    return true;
  });
}

// 분석 결과를 화면 실험에 바로 써볼 수 있는 답장 후보로 바꾸는 순수 함수입니다.
export function generateReplyOptions(
  input: EmotionContextAnalysisInput,
  analysis: Pick<EmotionContextAnalysisResult, "recommendedStrategy" | "possibleSignals">
): WarmReplyOption[] {
  const receiverName = getReceiverName(input);
  const signalIds = analysis.possibleSignals.map((signal) => signal.emotion);
  const hasLongGap = (input.relationshipContext?.daysSinceLastContact ?? 0) >= 7;
  const mainStrategy = analysis.recommendedStrategy.style;
  const options: WarmReplyOption[] = [];

  if (hasLongGap || mainStrategy === "apologize_first") {
    options.push(
      makeOption("요즘 연락이 뜸해서 미안해요. 오늘은 저녁 잘 챙겨 먹었어요.", "gentle", "apologize_first", signalIds, "연락 공백이 길 때는 설명보다 짧은 사과와 현재 상태 공유가 먼저 도움이 됩니다.")
    );
  }

  if (mainStrategy === "light_check" || input.messageText.trim().length <= 3) {
    options.push(
      makeOption("응, 알겠어요. 혹시 무슨 일 있으셨어요?", "casual", "light_check", signalIds, "짧은 메시지에는 감정을 단정하지 않고 분위기만 확인합니다."),
      makeOption("알겠어~ 지금은 짧게 답할게. 나중에 다시 얘기하자.", "casual", "give_space", signalIds, "대화 여지를 남기면서 부담을 줄입니다.")
    );
  }

  if (mainStrategy === "warm_acknowledge" || signalIds.includes("worry") || signalIds.includes("longing")) {
    options.push(
      makeOption("응 먹었어요! 걱정해줘서 고마워요. 엄마도 저녁 챙겨 드셨어요?", "warm", "warm_acknowledge", signalIds, "걱정이나 그리움의 신호를 부드럽게 받아줍니다."),
      makeOption("먹었어~ 오늘은 바빠도 잘 챙겨 먹었어요. 엄마는 오늘 뭐 드셨어요?", "warm", "ask_back", signalIds, "짧은 일상 공유 뒤 부모님에게 관심을 되돌립니다.")
    );
  }

  if (mainStrategy === "ask_back" || signalIds.includes("curiosity") || signalIds.includes("routine_check")) {
    options.push(
      makeOption(`${receiverName === "너" ? "너는" : receiverName} 오늘은 어떻게 보냈어요?`, "warm", "ask_back", signalIds, "상대의 일상 관심에 같은 방향의 관심으로 응답합니다."),
      makeOption("저는 오늘 일이 좀 많았는데 괜찮았어요. 엄마는 별일 없으셨어요?", "gentle", "share_daily_detail", signalIds, "일상 정보를 조금 더해 대화가 이어질 수 있게 합니다.")
    );
  }

  if (mainStrategy === "direct_call") {
    options.push(
      makeOption("문자로 길게 말하기보다 오늘 저녁에 잠깐 전화할까요?", "gentle", "direct_call", signalIds, "건강이나 서운함처럼 뉘앙스가 중요한 상황에서는 통화가 더 적절할 수 있습니다.")
    );
  }

  if (mainStrategy === "give_space") {
    options.push(
      makeOption("지금 바로 답하기 어려우면 괜찮아요. 편할 때 얘기해줘요.", "gentle", "give_space", signalIds, "민감한 상황에서는 캐묻기보다 선택권을 남깁니다.")
    );
  }

  if (options.length === 0) {
    options.push(
      makeOption("응, 확인했어요. 오늘은 별일 없었어요?", "casual", "ask_back", signalIds, "뚜렷한 정서 신호가 약할 때는 가볍게 대화를 이어갑니다.")
    );
  }

  return uniqueOptions(options).slice(0, 4);
}

