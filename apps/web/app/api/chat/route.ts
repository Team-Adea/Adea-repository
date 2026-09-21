import {
  streamText,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { ADEA_SYSTEM_PROMPT } from "@adea/core";
import { createClient } from "@/lib/supabase/server";

// Adea's chat model. Uses OPENAI_API_KEY; override the model with OPENAI_MODEL.
const MODEL = process.env.OPENAI_MODEL ?? "gpt-5-mini";

export async function POST(req: Request) {
  // Only signed-in users can talk to Adea.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai(MODEL),
    system: ADEA_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
