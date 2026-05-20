import { handleAiMockPost } from "@/lib/ai/pipeline";

export async function POST(request: Request) {
  return handleAiMockPost("care-action", request);
}
