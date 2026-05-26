import type { AccommodationLevel, EmotionContextAnalysisInput } from "./contextTypes";

const QUESTION_RE = /[?？]|\b(니|나요|까요|세요)\??$/;
const WORRY_RE = /(걱정|조심|위험|아프|병원|밥|식사|늦게|괜찮)/;
const EMPATHY_RE = /(고마|걱정해줘서|그랬구나|속상|미안|다행|괜찮으세요|이해)/;
const DAILY_SHARE_RE = /(오늘|아까|회사|학교|집|밥|저녁|점심|일|회의|운동)/;

function isVeryShort(text: string) {
  return text.trim().length <= 3;
}

function hasQuestion(text: string) {
  return QUESTION_RE.test(text.trim());
}

function countRecentParentWorry(input: EmotionContextAnalysisInput) {
  return (input.recentMessages ?? []).filter(
    (message) => message.senderRole === "parent" && WORRY_RE.test(message.text)
  ).length;
}

// 커뮤니케이션 수용 수준을 대략적으로 가늠하는 mock 판단입니다.
export function analyzeAccommodationLevel(input: EmotionContextAnalysisInput): AccommodationLevel {
  const text = input.messageText.trim();
  const recentParentWorryCount = countRecentParentWorry(input);

  if (
    input.senderRole === "child" &&
    isVeryShort(text) &&
    !hasQuestion(text) &&
    input.relationshipContext?.usualReplyLength !== "short"
  ) {
    return "under";
  }

  if (
    input.senderRole === "parent" &&
    (recentParentWorryCount >= 2 || (WORRY_RE.test(text) && input.relationshipContext?.parentCommunicationStyle === "worrying"))
  ) {
    return "over";
  }

  if (EMPATHY_RE.test(text) && DAILY_SHARE_RE.test(text) && hasQuestion(text)) {
    return "appropriate";
  }

  if (!isVeryShort(text) && (hasQuestion(text) || EMPATHY_RE.test(text))) {
    return "appropriate";
  }

  return isVeryShort(text) ? "under" : "appropriate";
}

export function explainAccommodationLevel(
  level: AccommodationLevel,
  _input: EmotionContextAnalysisInput
) {
  switch (level) {
    case "under":
      return "상대가 무심하게 느낄 수 있는 짧은 표현입니다.";
    case "over":
      return "상대에게 부담이나 잔소리처럼 느껴질 수 있는 표현입니다.";
    case "appropriate":
      return "상대의 걱정이나 관심에 적절히 응답하는 표현입니다.";
  }
}

