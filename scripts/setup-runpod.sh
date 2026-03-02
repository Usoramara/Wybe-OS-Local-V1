#!/usr/bin/env bash
set -euo pipefail

# In-pod setup script for manual deployment (SSH into pod and run this)
# Alternative to the automated deploy-runpod.sh

MODEL_ID="${MODEL_ID:-Qwen/Qwen3.5-35B-A3B-FP8}"
MAX_MODEL_LEN="${MAX_MODEL_LEN:-8192}"
PORT="${PORT:-8000}"

echo "=== Setting up vLLM server ==="
echo "Model: $MODEL_ID"

# Start the vLLM server
python -m vllm.entrypoints.openai.api_server \
  --model "$MODEL_ID" \
  --max-model-len "$MAX_MODEL_LEN" \
  --trust-remote-code \
  --host 0.0.0.0 \
  --port "$PORT"
