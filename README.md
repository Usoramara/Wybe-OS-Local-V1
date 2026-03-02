# Wybe OS Local V1

Self-hosted Wybe voice + chat system. Runs **Qwen 3.5-35B-A3B-FP8** on RunPod A100 80GB with **ElevenLabs ConvAI** for voice (STT + TTS). Frontend deployed on Railway.

## Architecture

```
┌─────────────────────────────────┐
│  Next.js Frontend (Railway)     │
│  /voice  — ElevenLabs ConvAI    │──► ElevenLabs ConvAI Agent
│  /chat   — Text chat UI         │        │ (STT + TTS)
│  /api/v1/chat/completions       │        │
│  /api/convai/signed-url         │        ▼
└────────────┬────────────────────┘   Custom LLM → RunPod
             │
             ▼
┌─────────────────────────────────────────────┐
│  RunPod A100 80GB                           │
│  vLLM Server (port 8000)                    │
│  Qwen/Qwen3.5-35B-A3B-FP8                  │
│  OpenAI-compatible /v1/chat/completions     │
└─────────────────────────────────────────────┘
```

## Setup

### 1. Deploy Qwen on RunPod

```bash
./scripts/deploy-runpod.sh
```

Wait for the model to load, then verify:

```bash
QWEN_API_URL=https://<pod-id>-8000.proxy.runpod.net ./scripts/health-check.sh
```

### 2. Create ElevenLabs Agent

```bash
ELEVENLABS_API_KEY=xxx QWEN_API_URL=https://<pod-id>-8000.proxy.runpod.net ./scripts/create-elevenlabs-agent.sh
```

Save the returned `agent_id`.

### 3. Deploy Frontend (Railway)

```bash
# Set env vars in Railway dashboard or CLI:
# QWEN_API_URL, ELEVENLABS_API_KEY, ELEVENLABS_AGENT_ID

railway up
```

### 4. Local Development

```bash
cd frontend
cp .env.example .env.local
# Fill in your values
npm install
npm run dev
```

## Project Structure

```
├── frontend/          # Next.js 16 app
│   ├── src/app/
│   │   ├── voice/     # ElevenLabs ConvAI orb
│   │   ├── (app)/     # Sidebar layout
│   │   │   └── chat/  # Text chat
│   │   └── api/       # API routes
│   └── src/lib/       # Qwen client, conversation store
├── inference/         # vLLM server (RunPod)
├── scripts/           # Deployment automation
└── railway.toml       # Railway config
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `QWEN_API_URL` | RunPod vLLM endpoint URL |
| `ELEVENLABS_API_KEY` | ElevenLabs API key |
| `ELEVENLABS_AGENT_ID` | ElevenLabs ConvAI agent ID |
| `HUGGINGFACE_TOKEN` | (Optional) For gated model access |
