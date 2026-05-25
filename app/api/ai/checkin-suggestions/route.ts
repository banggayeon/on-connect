import { NextRequest, NextResponse } from "next/server";
import { generateCheckInSuggestions, getTimeOfDay } from "@/lib/ai/checkInGenerator";
import { getMockWeather } from "@/lib/weather/getWeatherContext";
import { demoDataset } from "@/lib/mockData";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const recipientId = typeof body.recipientId === "string" ? body.recipientId : undefined;
  const parent = demoDataset.parents.find((p) => p.id === recipientId) ?? demoDataset.parents[0];

  const records = parent.contactRecords30Days ?? [];
  const sortedRecords = [...records].sort((a, b) => b.date.localeCompare(a.date));
  const lastDate = sortedRecords[0]?.date;
  const daysSinceContact = lastDate
    ? Math.floor((Date.now() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24))
    : 7;

  const recentTags = sortedRecords
    .slice(0, 5)
    .flatMap((r) => r.tags)
    .filter((t) => !["low_response", "gift_hint", "brief", "brief_call", "missed_call", "practical"].includes(t));

  const weather = getMockWeather();

  const suggestions = generateCheckInSuggestions({
    recipientName: parent.name,
    recipientRole: parent.role,
    interests: parent.preferenceProfile.interests,
    avoidedTopics: parent.preferenceProfile.avoidedTopics,
    recentTopics: recentTags.slice(0, 3),
    weather,
    timeOfDay: getTimeOfDay(),
    daysSinceContact,
  });

  return NextResponse.json({ suggestions });
}
