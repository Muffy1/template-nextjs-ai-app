import { describe, it, expect } from "vitest";
import { getProvider, getBaseUrl, getModel } from "../src/lib/ai";

describe("AI client", () => {
  it("has a default provider", () => {
    expect(getProvider()).toBeTruthy();
  });
  it("returns a base url for any provider", () => {
    for (const p of ["ollama", "openai", "anthropic", "venice", "groq", "openrouter"] as const) {
      process.env.AI_PROVIDER = p;
      expect(getBaseUrl()).toMatch(/^https?:\/\//);
    }
  });
  it("returns a default model", () => {
    expect(getModel()).toBeTruthy();
  });
});
