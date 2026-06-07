# template-nextjs-ai-app

A Next.js 14 + TypeScript starter that delegates CI/CD to
[muffy86/infra-automation](https://github.com/muffy86/infra-automation).

## Quick start

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## What's wired up

- `package.json` — pnpm scripts for dev/build/lint/test/type-check
- `tsconfig.json` — strict mode, path aliases
- `next.config.mjs` — typed routes, strict mode
- `src/lib/ai.ts` — provider-agnostic AI client (Ollama / OpenAI / Anthropic / Venice / Groq / OpenRouter)
- `tests/sanity.test.ts` — Vitest sanity tests
- `.github/workflows/ci.yml` — delegates to infra-automation's `ci-node.yml`

## CI

Pushed by `muffy86/infra-automation/scripts/provision-new-repo.sh`. To upgrade
the CI, edit `.github/workflows/ci-node.yml` in `infra-automation` and consumers
pick it up via `@main`.

## Customizing the AI provider

```bash
# Local Ollama on the RTX 4080 Super rig
export AI_PROVIDER=ollama
export AI_BASE_URL=http://localhost:11434/v1
export AI_MODEL=qwen2.5:14b

# Cloud (Venice free tier)
export AI_PROVIDER=venice
export AI_API_KEY=...
```
