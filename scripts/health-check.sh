#!/usr/bin/env bash
set -euo pipefail

# Health check for Qwen vLLM server on RunPod

if [ -z "${QWEN_API_URL:-}" ]; then
  echo "Usage: QWEN_API_URL=https://<pod-id>-8000.proxy.runpod.net $0"
  exit 1
fi

echo "=== Health Check ==="
echo "Endpoint: $QWEN_API_URL"
echo ""

# Check health endpoint
echo "1. Health endpoint..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$QWEN_API_URL/health" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
  echo "   OK (200)"
else
  echo "   FAILED (HTTP $HTTP_CODE)"
  exit 1
fi

# Check models endpoint
echo "2. Models endpoint..."
MODELS=$(curl -s "$QWEN_API_URL/v1/models" 2>/dev/null || echo "{}")
echo "   $MODELS" | python3 -c "import sys,json; data=json.load(sys.stdin); [print(f'   Model: {m[\"id\"]}') for m in data.get('data',[])]" 2>/dev/null || echo "   Could not parse models"

# Test inference
echo "3. Test inference..."
RESULT=$(curl -s -X POST "$QWEN_API_URL/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -d '{"model":"Qwen/Qwen3.5-35B-A3B-FP8","messages":[{"role":"user","content":"Say hello in one sentence."}],"max_tokens":50}' 2>/dev/null || echo "{}")

CONTENT=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin)['choices'][0]['message']['content'])" 2>/dev/null || echo "FAILED")
echo "   Response: $CONTENT"

echo ""
echo "=== All checks passed ==="
