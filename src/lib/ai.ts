/**
 * AI client abstraction. Provider-agnostic.
 *
 * Configure via env vars (NEVER hard-code keys):
 *   AI_PROVIDER    = ollama | openai | anthropic | venice | groq | openrouter
 *   AI_MODEL       = model name (defaults per provider)
 *   AI_BASE_URL    = optional override (e.g. http://localhost:11434/v1 for Ollama)
 *   AI_API_KEY     = required for cloud providers
 *
 * The agent hardware-bridge sets AI_PROVIDER=ollama + AI_BASE_URL automatically
 * when running on the RTX 4080 Super rig.
 */

export type AIProvider = "ollama" | "openai" | "anthropic" | "venice" | "groq" | "openrouter";

export interface ChatRequest {
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  temperature?: number;
  max_tokens?: number;
}

export interface ChatResponse {
  content: string;
  model: string;
  provider: AIProvider;
  tokens_in?: number;
  tokens_out?: number;
}

export function getProvider(): AIProvider {
  return (process.env.AI_PROVIDER as AIProvider) || "ollama";
}

export function getBaseUrl(): string {
  if (process.env.AI_BASE_URL) return process.env.AI_BASE_URL;
  switch (getProvider()) {
    case "ollama": return "http://localhost:11434/v1";
    case "openai": return "https://api.openai.com/v1";
    case "anthropic": return "https://api.anthropic.com/v1";
    case "venice": return "https://api.venice.ai/v1";
    case "groq": return "https://api.groq.com/openai/v1";
    case "openrouter": return "https://openrouter.ai/api/v1";
  }
}

export function getModel(): string {
  if (process.env.AI_MODEL) return process.env.AI_MODEL;
  switch (getProvider()) {
    case "ollama": return "llama3.1:8b";
    case "openai": return "gpt-4o-mini";
    case "anthropic": return "claude-3-5-sonnet-20241022";
    case "venice": return "llama-3.1-405b";
    case "groq": return "llama-3.1-70b-versatile";
    case "openrouter": return "meta-llama/llama-3.1-70b-instruct";
  }
}

export async function chat(req: ChatRequest): Promise<ChatResponse> {
  const provider = getProvider();
  const baseUrl = getBaseUrl();
  const model = getModel();
  const apiKey = process.env.AI_API_KEY || "ollama";

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: req.messages,
      temperature: req.temperature ?? 0.7,
      max_tokens: req.max_tokens ?? 2048
    })
  });

  if (!res.ok) {
    throw new Error(`${provider} ${res.status}: ${await res.text()}`);
  }
  const j = await res.json() as { choices: Array<{ message: { content: string } }>; usage?: { prompt_tokens?: number; completion_tokens?: number } };
  return {
    content: j.choices[0]?.message?.content || "",
    model,
    provider,
    tokens_in: j.usage?.prompt_tokens,
    tokens_out: j.usage?.completion_tokens
  };
}
