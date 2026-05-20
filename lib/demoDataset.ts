import type { DemoFamilyDataset, DemoParentProfile } from "@/lib/types";

const motherContactRecords: DemoParentProfile["contactRecords30Days"] = [
  { id: "mom_contact_2026_04_17", parentId: "parent_mother", date: "2026-04-17", channel: "text", direction: "parentToChild", summary: "아침 먹었는지 짧게 물어봄", sentiment: "warm", responseLatencyMinutes: 18, tags: ["meal", "morning"] },
  { id: "mom_contact_2026_04_18", parentId: "parent_mother", date: "2026-04-18", channel: "call", direction: "childToParent", durationMinutes: 12, summary: "주말 장보기와 반찬 이야기", sentiment: "warm", tags: ["food", "weekend"] },
  { id: "mom_contact_2026_04_19", parentId: "parent_mother", date: "2026-04-19", channel: "photo", direction: "parentToChild", summary: "화분 새싹 사진 공유", sentiment: "warm", responseLatencyMinutes: 44, tags: ["plants", "photo"] },
  { id: "mom_contact_2026_04_20", parentId: "parent_mother", date: "2026-04-20", channel: "text", direction: "childToParent", summary: "퇴근 후 안부 메시지", sentiment: "neutral", responseLatencyMinutes: 30, tags: ["evening"] },
  { id: "mom_contact_2026_04_21", parentId: "parent_mother", date: "2026-04-21", channel: "text", direction: "parentToChild", summary: "비 오니 우산 챙기라는 메시지", sentiment: "warm", responseLatencyMinutes: 9, tags: ["weather", "care"] },
  { id: "mom_contact_2026_04_22", parentId: "parent_mother", date: "2026-04-22", channel: "call", direction: "childToParent", durationMinutes: 7, summary: "병원 예약은 괜찮다고 말함", sentiment: "concerned", tags: ["health"] },
  { id: "mom_contact_2026_04_23", parentId: "parent_mother", date: "2026-04-23", channel: "text", direction: "parentToChild", summary: "저녁 메뉴를 물어봄", sentiment: "warm", responseLatencyMinutes: 22, tags: ["meal"] },
  { id: "mom_contact_2026_04_24", parentId: "parent_mother", date: "2026-04-24", channel: "text", direction: "childToParent", summary: "늦은 답장과 업무가 바빴다는 설명", sentiment: "neutral", responseLatencyMinutes: 86, tags: ["work"] },
  { id: "mom_contact_2026_04_25", parentId: "parent_mother", date: "2026-04-25", channel: "call", direction: "parentToChild", durationMinutes: 15, summary: "생신 때 가족 식사 가능 여부 확인", sentiment: "warm", tags: ["birthday", "meal"] },
  { id: "mom_contact_2026_04_26", parentId: "parent_mother", date: "2026-04-26", channel: "photo", direction: "childToParent", summary: "카페 사진을 보내며 다음에 같이 가자고 함", sentiment: "warm", responseLatencyMinutes: 16, tags: ["photo", "outing"] },
  { id: "mom_contact_2026_04_27", parentId: "parent_mother", date: "2026-04-27", channel: "text", direction: "parentToChild", summary: "허리가 조금 뻐근하다고 언급", sentiment: "concerned", responseLatencyMinutes: 35, tags: ["health", "back"] },
  { id: "mom_contact_2026_04_28", parentId: "parent_mother", date: "2026-04-28", channel: "text", direction: "childToParent", summary: "무리하지 말고 쉬라는 답장", sentiment: "warm", responseLatencyMinutes: 12, tags: ["health"] },
  { id: "mom_contact_2026_04_29", parentId: "parent_mother", date: "2026-04-29", channel: "text", direction: "parentToChild", summary: "아침 인사만 남김", sentiment: "neutral", responseLatencyMinutes: 52, tags: ["morning"] },
  { id: "mom_contact_2026_04_30", parentId: "parent_mother", date: "2026-04-30", channel: "call", direction: "childToParent", durationMinutes: 9, summary: "근황과 날씨 이야기", sentiment: "warm", tags: ["weather"] },
  { id: "mom_contact_2026_05_01", parentId: "parent_mother", date: "2026-05-01", channel: "text", direction: "parentToChild", summary: "연휴 계획을 물어봄", sentiment: "warm", responseLatencyMinutes: 24, tags: ["holiday"] },
  { id: "mom_contact_2026_05_02", parentId: "parent_mother", date: "2026-05-02", channel: "call", direction: "childToParent", durationMinutes: 18, summary: "생신 식당 후보를 같이 이야기함", sentiment: "warm", tags: ["birthday", "meal"] },
  { id: "mom_contact_2026_05_03", parentId: "parent_mother", date: "2026-05-03", channel: "text", direction: "parentToChild", summary: "무릎보다 허리가 더 신경 쓰인다고 말함", sentiment: "concerned", responseLatencyMinutes: 41, tags: ["health", "back"] },
  { id: "mom_contact_2026_05_04", parentId: "parent_mother", date: "2026-05-04", channel: "text", direction: "childToParent", summary: "주말에 들르겠다고 알림", sentiment: "warm", responseLatencyMinutes: 11, tags: ["visit"] },
  { id: "mom_contact_2026_05_05", parentId: "parent_mother", date: "2026-05-05", channel: "photo", direction: "parentToChild", summary: "집에서 만든 반찬 사진 공유", sentiment: "warm", responseLatencyMinutes: 19, tags: ["food", "photo"] },
  { id: "mom_contact_2026_05_06", parentId: "parent_mother", date: "2026-05-06", channel: "text", direction: "childToParent", summary: "답장이 늦어 미안하다고 보냄", sentiment: "neutral", responseLatencyMinutes: 120, tags: ["work"] },
  { id: "mom_contact_2026_05_07", parentId: "parent_mother", date: "2026-05-07", channel: "call", direction: "parentToChild", durationMinutes: 6, summary: "짧은 통화, 피곤하다고 말함", sentiment: "concerned", tags: ["fatigue"] },
  { id: "mom_contact_2026_05_08", parentId: "parent_mother", date: "2026-05-08", channel: "text", direction: "childToParent", summary: "어버이날 감사 메시지", sentiment: "warm", responseLatencyMinutes: 8, tags: ["parents_day"] },
  { id: "mom_contact_2026_05_09", parentId: "parent_mother", date: "2026-05-09", channel: "call", direction: "childToParent", durationMinutes: 22, summary: "생신 전날 가족 식사 시간 확인", sentiment: "warm", tags: ["birthday", "meal"] },
  { id: "mom_contact_2026_05_10", parentId: "parent_mother", date: "2026-05-10", channel: "call", direction: "childToParent", durationMinutes: 34, summary: "생신 축하 통화와 선물 감사 인사", sentiment: "warm", tags: ["birthday", "gift"] },
  { id: "mom_contact_2026_05_11", parentId: "parent_mother", date: "2026-05-11", channel: "text", direction: "parentToChild", summary: "어제 고마웠다고 말함", sentiment: "warm", responseLatencyMinutes: 15, tags: ["thanks"] },
  { id: "mom_contact_2026_05_12", parentId: "parent_mother", date: "2026-05-12", channel: "text", direction: "parentToChild", summary: "허리가 아직 뻐근하다고 짧게 언급", sentiment: "concerned", responseLatencyMinutes: 28, tags: ["health", "back"] },
  { id: "mom_contact_2026_05_13", parentId: "parent_mother", date: "2026-05-13", channel: "text", direction: "childToParent", summary: "가벼운 산책만 하라고 답장", sentiment: "warm", responseLatencyMinutes: 13, tags: ["health", "walk"] },
  { id: "mom_contact_2026_05_14", parentId: "parent_mother", date: "2026-05-14", channel: "text", direction: "parentToChild", summary: "저녁을 챙겨 먹었는지 물어봄", sentiment: "warm", responseLatencyMinutes: 20, tags: ["meal", "evening"] },
  { id: "mom_contact_2026_05_15", parentId: "parent_mother", date: "2026-05-15", channel: "text", direction: "childToParent", summary: "퇴근 후 짧은 안부", sentiment: "neutral", responseLatencyMinutes: 65, tags: ["evening", "work"] },
  { id: "mom_contact_2026_05_16", parentId: "parent_mother", date: "2026-05-16", channel: "text", direction: "parentToChild", summary: "오늘 저녁 뭐 먹니?", sentiment: "warm", responseLatencyMinutes: 8, tags: ["meal", "evening"] }
];

const fatherContactRecords: DemoParentProfile["contactRecords30Days"] = [
  { id: "dad_contact_2026_04_17", parentId: "parent_father", date: "2026-04-17", channel: "text", direction: "childToParent", summary: "야구 경기 이야기를 보냄", sentiment: "warm", responseLatencyMinutes: 180, tags: ["baseball"] },
  { id: "dad_contact_2026_04_18", parentId: "parent_father", date: "2026-04-18", channel: "missed", direction: "childToParent", summary: "부재중 전화 후 후속 대화 없음", sentiment: "missed", tags: ["missed_call"] },
  { id: "dad_contact_2026_04_19", parentId: "parent_father", date: "2026-04-19", channel: "photo", direction: "parentToChild", summary: "등산길 사진 전송", sentiment: "warm", responseLatencyMinutes: 240, tags: ["hiking", "photo"] },
  { id: "dad_contact_2026_04_20", parentId: "parent_father", date: "2026-04-20", channel: "text", direction: "parentToChild", summary: "차 점검을 했다는 짧은 메시지", sentiment: "neutral", responseLatencyMinutes: 210, tags: ["car"] },
  { id: "dad_contact_2026_04_21", parentId: "parent_father", date: "2026-04-21", channel: "call", direction: "childToParent", durationMinutes: 4, summary: "짧게 업무 괜찮냐고 물음", sentiment: "neutral", tags: ["work"] },
  { id: "dad_contact_2026_04_22", parentId: "parent_father", date: "2026-04-22", channel: "text", direction: "parentToChild", summary: "뉴스 링크 공유", sentiment: "neutral", responseLatencyMinutes: 360, tags: ["news"] },
  { id: "dad_contact_2026_04_23", parentId: "parent_father", date: "2026-04-23", channel: "text", direction: "childToParent", summary: "주말 등산 조심하라고 답장", sentiment: "warm", responseLatencyMinutes: 75, tags: ["hiking"] },
  { id: "dad_contact_2026_04_24", parentId: "parent_father", date: "2026-04-24", channel: "text", direction: "parentToChild", summary: "답장 없이 읽음", sentiment: "neutral", responseLatencyMinutes: 600, tags: ["low_response"] },
  { id: "dad_contact_2026_04_25", parentId: "parent_father", date: "2026-04-25", channel: "call", direction: "parentToChild", durationMinutes: 8, summary: "차 보험 갱신 이야기", sentiment: "neutral", tags: ["car", "practical"] },
  { id: "dad_contact_2026_04_26", parentId: "parent_father", date: "2026-04-26", channel: "photo", direction: "parentToChild", summary: "산 정상 사진 공유", sentiment: "warm", responseLatencyMinutes: 32, tags: ["hiking", "photo"] },
  { id: "dad_contact_2026_04_27", parentId: "parent_father", date: "2026-04-27", channel: "text", direction: "childToParent", summary: "사진 멋지다고 답장", sentiment: "warm", responseLatencyMinutes: 24, tags: ["photo"] },
  { id: "dad_contact_2026_04_28", parentId: "parent_father", date: "2026-04-28", channel: "text", direction: "parentToChild", summary: "요즘 잠을 늦게 잔다고 말함", sentiment: "concerned", responseLatencyMinutes: 300, tags: ["sleep"] },
  { id: "dad_contact_2026_04_29", parentId: "parent_father", date: "2026-04-29", channel: "text", direction: "childToParent", summary: "밤 운전 조심하라고 보냄", sentiment: "warm", responseLatencyMinutes: 40, tags: ["driving"] },
  { id: "dad_contact_2026_04_30", parentId: "parent_father", date: "2026-04-30", channel: "text", direction: "parentToChild", summary: "퇴직 동료 모임 이야기를 짧게 함", sentiment: "neutral", responseLatencyMinutes: 190, tags: ["friends"] },
  { id: "dad_contact_2026_05_01", parentId: "parent_father", date: "2026-05-01", channel: "call", direction: "childToParent", durationMinutes: 5, summary: "연휴 운전 계획 확인", sentiment: "neutral", tags: ["holiday", "driving"] },
  { id: "dad_contact_2026_05_02", parentId: "parent_father", date: "2026-05-02", channel: "text", direction: "parentToChild", summary: "등산화가 낡았다고 언급", sentiment: "neutral", responseLatencyMinutes: 220, tags: ["hiking", "gift_hint"] },
  { id: "dad_contact_2026_05_03", parentId: "parent_father", date: "2026-05-03", channel: "photo", direction: "parentToChild", summary: "아침 산책 사진", sentiment: "warm", responseLatencyMinutes: 70, tags: ["walk", "photo"] },
  { id: "dad_contact_2026_05_04", parentId: "parent_father", date: "2026-05-04", channel: "text", direction: "childToParent", summary: "날씨 좋을 때 같이 걷자고 보냄", sentiment: "warm", responseLatencyMinutes: 55, tags: ["walk"] },
  { id: "dad_contact_2026_05_05", parentId: "parent_father", date: "2026-05-05", channel: "text", direction: "parentToChild", summary: "별다른 답 없이 이모티콘만 보냄", sentiment: "neutral", responseLatencyMinutes: 1440, tags: ["brief"] },
  { id: "dad_contact_2026_05_06", parentId: "parent_father", date: "2026-05-06", channel: "call", direction: "childToParent", durationMinutes: 3, summary: "전화했지만 금방 끊음", sentiment: "neutral", tags: ["brief_call"] },
  { id: "dad_contact_2026_05_07", parentId: "parent_father", date: "2026-05-07", channel: "text", direction: "parentToChild", summary: "무릎이 약간 뻐근하다고 말함", sentiment: "concerned", responseLatencyMinutes: 260, tags: ["health", "knee"] },
  { id: "dad_contact_2026_05_08", parentId: "parent_father", date: "2026-05-08", channel: "text", direction: "childToParent", summary: "어버이날 감사 메시지와 용돈 송금 알림", sentiment: "warm", responseLatencyMinutes: 35, tags: ["parents_day"] },
  { id: "dad_contact_2026_05_09", parentId: "parent_father", date: "2026-05-09", channel: "text", direction: "parentToChild", summary: "고맙다는 짧은 답장", sentiment: "warm", responseLatencyMinutes: 90, tags: ["thanks", "brief"] },
  { id: "dad_contact_2026_05_10", parentId: "parent_father", date: "2026-05-10", channel: "call", direction: "parentToChild", durationMinutes: 6, summary: "엄마 생신 식사 장소 확인", sentiment: "warm", tags: ["birthday", "meal"] },
  { id: "dad_contact_2026_05_11", parentId: "parent_father", date: "2026-05-11", channel: "text", direction: "childToParent", summary: "이번 주말 산책 제안", sentiment: "warm", responseLatencyMinutes: 120, tags: ["walk"] },
  { id: "dad_contact_2026_05_12", parentId: "parent_father", date: "2026-05-12", channel: "text", direction: "parentToChild", summary: "요즘 피곤하니 일찍 자라는 메시지", sentiment: "warm", responseLatencyMinutes: 480, tags: ["sleep", "care"] },
  { id: "dad_contact_2026_05_13", parentId: "parent_father", date: "2026-05-13", channel: "text", direction: "childToParent", summary: "네 아빠도 무리하지 말라고 답장", sentiment: "warm", responseLatencyMinutes: 42, tags: ["health"] },
  { id: "dad_contact_2026_05_14", parentId: "parent_father", date: "2026-05-14", channel: "text", direction: "parentToChild", summary: "야구 중계 시간 공유", sentiment: "neutral", responseLatencyMinutes: 210, tags: ["baseball"] },
  { id: "dad_contact_2026_05_15", parentId: "parent_father", date: "2026-05-15", channel: "call", direction: "childToParent", durationMinutes: 10, summary: "주말 산책 약속 조율", sentiment: "warm", tags: ["walk", "weekend"] },
  { id: "dad_contact_2026_05_16", parentId: "parent_father", date: "2026-05-16", channel: "photo", direction: "parentToChild", summary: "새 등산로 표지판 사진을 보냄", sentiment: "warm", responseLatencyMinutes: 26, tags: ["hiking", "photo"] }
];

export const demoDataset = {
  version: "2026-05-family-agent-demo-v1",
  generatedAt: "2026-05-16",
  child: {
    id: "child_mingwon",
    role: "child",
    name: "민권",
    displayName: "민권님",
    age: 26,
    relationLabel: "자녀",
    familyNickname: "우리 아들"
  },
  parents: [
    {
      id: "parent_mother",
      role: "mother",
      name: "어머니",
      displayName: "엄마",
      age: 56,
      relationLabel: "엄마와의 연결",
      preferenceProfile: {
        interests: ["집밥", "화분", "동네 카페", "가벼운 산책", "가족 식사"],
        birthday: { month: 5, day: 10, label: "엄마 생신" },
        preferredContactWindows: [
          { id: "mom_evening", label: "저녁 8시 전후", startTime: "19:30", endTime: "20:30", reason: "저녁 식사 후 답장이 가장 자연스러움" },
          { id: "mom_morning", label: "아침 8시 전후", startTime: "07:50", endTime: "08:30", reason: "식사 안부를 부담 없이 주고받기 좋음" }
        ],
        tonePreferences: ["warm", "polite"],
        avoidedTopics: ["직접적인 병원 압박", "긴 설명이 필요한 건강 질문"],
        consentSettings: [
          { scope: "preferredContactTime", label: "안부 시간", enabled: true, description: "안부를 주고받기 좋은 시간대" },
          { scope: "interests", label: "관심사", enabled: true, description: "식사, 산책, 화분처럼 대화에 도움되는 주제" },
          { scope: "conversationNotes", label: "대화 메모", enabled: true, description: "부모님이 직접 말한 관심사와 짧은 메모" },
          { scope: "careSignals", label: "건강/생활 신호", enabled: true, description: "피로, 허리 통증 등 부모님이 직접 언급한 신호" },
          { scope: "giftHints", label: "선물 힌트", enabled: true, description: "생신과 최근 대화에서 나온 선물 단서" },
          { scope: "location", label: "위치 정보", enabled: false, description: "사용하지 않음" }
        ]
      },
      contactRecords30Days: motherContactRecords,
      conversationMemos: [
        { id: "mom_memo_birthday_meal", parentId: "parent_mother", date: "2026-05-02", title: "생신 식사는 조용한 곳 선호", memo: "사람이 너무 많은 곳보다 예약 가능한 한식집을 좋아한다고 말함.", extractedTopics: ["birthday", "meal", "quiet_place"], suggestedFollowUp: "생신 이후에도 식사는 괜찮았는지 가볍게 물어보기" },
        { id: "mom_memo_back_pain", parentId: "parent_mother", date: "2026-05-12", title: "허리 뻐근함 반복", memo: "최근 3회 허리가 뻐근하다고 언급. 직접적인 병원 질문에는 부담을 느낄 수 있음.", extractedTopics: ["health", "back", "fatigue"], suggestedFollowUp: "건강 확인보다 산책이나 휴식 이야기로 시작하기" },
        { id: "mom_memo_plants", parentId: "parent_mother", date: "2026-04-19", title: "화분 사진에 반응 좋음", memo: "화분 새싹 사진을 보내며 기분이 좋아 보였고 답장이 빨랐음.", extractedTopics: ["plants", "photo", "mood"], suggestedFollowUp: "다음 통화 때 화분이 더 자랐는지 물어보기" }
      ],
      careSignals: [
        { id: "mom_signal_back", parentId: "parent_mother", date: "2026-05-12", category: "health", severity: "medium", title: "허리 통증 언급 반복", evidence: "최근 30일 대화에서 허리 관련 키워드 3회", recommendationHint: "직접적인 진단 질문보다 휴식과 일상 안부로 시작" },
        { id: "mom_signal_fast_reply", parentId: "parent_mother", date: "2026-05-16", category: "relationship", severity: "low", title: "식사 주제 응답률 높음", evidence: "식사/반찬 주제 메시지 평균 응답 20분 이내", recommendationHint: "저녁 식사 질문으로 대화 시작" },
        { id: "mom_signal_fatigue", parentId: "parent_mother", date: "2026-05-07", category: "mood", severity: "medium", title: "피로 표현", evidence: "짧은 통화에서 피곤하다고 언급", recommendationHint: "긴 통화보다 짧은 따뜻한 메시지 추천" }
      ],
      giftCandidates: [
        { id: "mom_gift_red_ginseng", parentId: "parent_mother", name: "홍삼정 선물세트", category: "health", priceRange: "4만-6만원", occasionFit: "생신 이후 건강 챙김", reason: "피로와 허리 통증 표현이 반복되어 건강을 챙기는 마음이 자연스럽게 전해짐", careActionPairing: "선물보다 먼저 오늘 컨디션을 짧게 물어보기", priority: "high" },
        { id: "mom_gift_flower_pot", parentId: "parent_mother", name: "작은 화분 세트", category: "hobby", priceRange: "2만-4만원", occasionFit: "일상 기분 전환", reason: "화분 사진 공유 때 반응이 좋았고 부담이 낮음", careActionPairing: "화분 사진 이야기를 꺼내며 같이 고르자고 제안", priority: "medium" },
        { id: "mom_gift_cafe_coupon", parentId: "parent_mother", name: "동네 카페 쿠폰", category: "experience", priceRange: "1만-3만원", occasionFit: "가벼운 외출", reason: "조용한 카페와 산책 주제에 긍정적", careActionPairing: "주말에 짧게 산책 후 들르자고 제안", priority: "medium" }
      ],
      agentSeedSummary: {
        relationshipTemperature: { valueCelsius: 36.8, trendCelsius: 2, progressPercent: 78, stateLabel: "따뜻함", rationale: "최근 식사/생신 대화 반응이 좋지만 건강 언급이 반복됨" },
        parentBriefing: { title: "엄마는 오늘 건강 확인보다 가벼운 식사 안부가 좋아요.", summary: "최근 허리 통증 언급이 있었지만 식사 주제에는 빠르게 반응했어요.", recommendedAction: "저녁 8시 전후로 오늘 저녁은 뭐 드셨어요?처럼 부담 없는 질문을 보내보세요." },
        warmReplyAI: { incomingMessage: "오늘 저녁 뭐 먹니?", intent: "걱정보다 일상 관심 표현", suggestedReply: "잘 먹었어요. 엄마도 식사 챙기세요.", reason: "짧지만 안심되는 답장이 어머니의 말투 선호와 잘 맞음" },
        careAction: { title: "짧은 저녁 안부 보내기", body: "건강 질문보다 식사와 휴식 이야기를 먼저 꺼내면 자연스럽습니다.", priority: "high" }
      }
    },
    {
      id: "parent_father",
      role: "father",
      name: "아버지",
      displayName: "아빠",
      age: 58,
      relationLabel: "아빠와의 연결",
      preferenceProfile: {
        interests: ["등산", "야구", "자동차 관리", "뉴스", "주말 산책"],
        birthday: { month: 11, day: 2, label: "아빠 생신" },
        preferredContactWindows: [
          { id: "dad_lunch", label: "점심 12시 전후", startTime: "11:40", endTime: "12:30", reason: "짧은 실용 대화에 답장이 빠름" },
          { id: "dad_weekend_morning", label: "주말 오전", startTime: "09:00", endTime: "10:30", reason: "등산이나 산책 사진을 공유하는 시간대" }
        ],
        tonePreferences: ["practical", "brief"],
        avoidedTopics: ["감정 표현을 오래 요구하는 질문", "반복적인 건강 확인"],
        consentSettings: [
          { scope: "preferredContactTime", label: "안부 시간", enabled: true, description: "짧은 통화와 메시지에 좋은 시간대" },
          { scope: "interests", label: "관심사", enabled: true, description: "등산, 야구, 자동차처럼 대화에 도움되는 주제" },
          { scope: "conversationNotes", label: "대화 메모", enabled: true, description: "최근 말한 취미와 실용 대화 메모" },
          { scope: "careSignals", label: "건강/생활 신호", enabled: true, description: "수면, 무릎 뻐근함 등 직접 언급한 신호" },
          { scope: "giftHints", label: "선물 힌트", enabled: true, description: "등산화 등 최근 대화에서 나온 선물 단서" },
          { scope: "location", label: "위치 정보", enabled: false, description: "사용하지 않음" }
        ]
      },
      contactRecords30Days: fatherContactRecords,
      conversationMemos: [
        { id: "dad_memo_hiking_shoes", parentId: "parent_father", date: "2026-05-02", title: "등산화가 낡았다고 언급", memo: "선물 후보로 직접적인 힌트가 있으나 사이즈 확인이 필요함.", extractedTopics: ["hiking", "gift_hint"], suggestedFollowUp: "이번 주 산책 때 등산화 브랜드나 사이즈를 자연스럽게 물어보기" },
        { id: "dad_memo_sleep", parentId: "parent_father", date: "2026-04-28", title: "수면 시간이 늦어짐", memo: "잠을 늦게 잔다고 말했지만 건강 질문은 길게 이어가지 않음.", extractedTopics: ["sleep", "routine"], suggestedFollowUp: "건강 확인보다 야구 경기 끝나고 바로 쉬었는지 짧게 묻기" },
        { id: "dad_memo_brief_style", parentId: "parent_father", date: "2026-05-05", title: "짧은 답장 선호", memo: "이모티콘이나 한 문장 답장이 많음. 긴 감정 질문에는 반응이 느림.", extractedTopics: ["brief", "tone"], suggestedFollowUp: "한 가지 주제만 담은 짧은 문장으로 연락하기" }
      ],
      careSignals: [
        { id: "dad_signal_sleep", parentId: "parent_father", date: "2026-04-28", category: "routine", severity: "medium", title: "늦은 수면 언급", evidence: "잠을 늦게 잔다고 직접 언급", recommendationHint: "긴 걱정보다 일찍 쉬라는 짧은 메시지 추천" },
        { id: "dad_signal_knee", parentId: "parent_father", date: "2026-05-07", category: "health", severity: "medium", title: "무릎 뻐근함", evidence: "등산 이후 무릎이 약간 뻐근하다고 말함", recommendationHint: "등산 장비나 휴식 이야기를 실용적으로 연결" },
        { id: "dad_signal_photo", parentId: "parent_father", date: "2026-05-16", category: "relationship", severity: "low", title: "사진 공유가 대화 시작점", evidence: "등산/산책 사진을 먼저 보내는 패턴", recommendationHint: "사진에 구체적으로 반응하면 대화가 자연스럽게 이어짐" }
      ],
      giftCandidates: [
        { id: "dad_gift_hiking_socks", parentId: "parent_father", name: "쿠션 등산 양말", category: "practical", priceRange: "1만-3만원", occasionFit: "주말 산책/등산", reason: "등산 빈도가 높고 무릎 뻐근함이 있어 부담 낮은 실용 선물", careActionPairing: "산책 약속 전에 발 편한지 짧게 물어보기", priority: "high" },
        { id: "dad_gift_baseball_ticket", parentId: "parent_father", name: "야구 경기 티켓", category: "experience", priceRange: "3만-8만원", occasionFit: "부자 외출", reason: "야구 중계 공유가 반복되어 함께 보내는 시간이 관계 개선에 적합", careActionPairing: "응원팀 경기 날짜 하나만 골라 제안", priority: "medium" },
        { id: "dad_gift_car_cleaning", parentId: "parent_father", name: "자동차 실내 세차권", category: "practical", priceRange: "3만-5만원", occasionFit: "실용 케어", reason: "자동차 관리 대화를 자주 하고 실용적 선호가 강함", careActionPairing: "보험이나 차 점검 이야기를 이어받아 자연스럽게 제안", priority: "medium" }
      ],
      agentSeedSummary: {
        relationshipTemperature: { valueCelsius: 35.9, trendCelsius: 0.6, progressPercent: 62, stateLabel: "조용히 따뜻함", rationale: "연락 빈도는 유지되지만 답장 지연과 짧은 대화가 많음" },
        parentBriefing: { title: "아빠는 짧고 실용적인 반응이 가장 좋아요.", summary: "최근 등산 사진과 야구 이야기에 반응이 있었고, 건강 질문은 길게 이어지지 않았어요.", recommendedAction: "사진에 구체적으로 답하고 주말 산책 약속을 한 문장으로 제안해보세요." },
        warmReplyAI: { incomingMessage: "새 등산로 표지판 사진 보낸다.", intent: "취미 공유를 통한 안부", suggestedReply: "길 좋아 보이네요. 주말엔 무릎 무리 안 가게 짧게 같이 걸어요.", reason: "사진 반응, 실용 케어, 짧은 제안을 한 문장에 담음" },
        careAction: { title: "주말 짧은 산책 제안", body: "등산 사진에 반응한 뒤 무릎 부담이 적은 코스로 같이 걷자고 제안하세요.", priority: "medium" }
      }
    }
  ]
} satisfies DemoFamilyDataset;

export const demoChild = demoDataset.child;
export const demoMother = demoDataset.parents[0];
export const demoFather = demoDataset.parents[1];
