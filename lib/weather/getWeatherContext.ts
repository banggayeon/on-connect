import type { WeatherContext } from "@/lib/types";

const MOCK_WEATHER: WeatherContext = {
  condition: "맑음",
  temperature: 22,
  summary: "서울 22°C · 맑음",
  checkInHint: "날씨가 좋아서 산책 이야기를 꺼내기 좋아요.",
};

const WMO_KO: Record<number, string> = {
  0: "맑음", 1: "대체로 맑음", 2: "부분적으로 흐림", 3: "흐림",
  45: "안개", 48: "안개",
  51: "가랑비", 53: "비", 55: "비",
  56: "얼어붙는 비", 57: "얼어붙는 비",
  61: "비", 63: "비", 65: "비",
  66: "얼음비", 67: "얼음비",
  71: "눈", 73: "눈", 75: "눈", 77: "눈",
  80: "소나기", 81: "소나기", 82: "소나기",
  85: "눈소나기", 86: "눈소나기",
  95: "뇌우", 96: "뇌우", 99: "뇌우",
};

function makeHint(condition: string, temp: number): string {
  const isNice = condition === "맑음" || condition === "대체로 맑음";
  if (isNice && temp >= 18 && temp <= 27) return "날씨가 좋아서 산책 이야기를 꺼내기 좋아요.";
  if (temp > 28) return "더운 날씨라 시원하게 지내시는지 안부 묻기 좋아요.";
  if (temp < 5) return "추운 날씨라 따뜻하게 지내시는지 안부 묻기 좋아요.";
  if (condition.includes("비") || condition.includes("소나기")) return "비 오는 날 우산 챙기셨는지 안부 묻기 좋아요.";
  if (condition.includes("눈")) return "눈 오는 날 미끄럽지 않으신지 안부 묻기 좋아요.";
  return "날씨를 언급하며 가볍게 안부를 건네보세요.";
}

// Open-Meteo — free, no API key, Seoul coords
export async function getWeatherContext(_location?: string): Promise<WeatherContext> {
  try {
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      "?latitude=37.5665&longitude=126.9780" +
      "&current=temperature_2m,weathercode" +
      "&timezone=Asia%2FSeoul";
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return MOCK_WEATHER;
    const data = await res.json();
    const temp = Math.round(data.current?.temperature_2m ?? 22);
    const code: number = data.current?.weathercode ?? 0;
    const condition = WMO_KO[code] ?? "흐림";
    return {
      condition,
      temperature: temp,
      summary: `서울 ${temp}°C · ${condition}`,
      checkInHint: makeHint(condition, temp),
    };
  } catch {
    return MOCK_WEATHER;
  }
}

export function getMockWeather(): WeatherContext {
  return MOCK_WEATHER;
}
