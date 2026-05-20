import { handleAiMockPost } from "@/lib/ai/pipeline";

export async function POST(request: Request) {
  return handleAiMockPost("report", request);
}
