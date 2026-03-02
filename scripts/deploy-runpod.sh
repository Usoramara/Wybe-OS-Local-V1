#!/usr/bin/env bash
set -euo pipefail

# Deploy Qwen 3.5-35B-A3B-FP8 on RunPod A100 80GB
# Requires: runpodctl CLI (https://github.com/runpod/runpodctl)

POD_NAME="${POD_NAME:-wybe-os-local-qwen}"
GPU_TYPE="${GPU_TYPE:-NVIDIA A100 80GB PCIe}"
GPU_COUNT="${GPU_COUNT:-1}"
CONTAINER_DISK="${CONTAINER_DISK:-50}"
VOLUME_SIZE="${VOLUME_SIZE:-150}"
IMAGE="${IMAGE:-vllm/vllm-openai:latest}"
MODEL_ID="${MODEL_ID:-Qwen/Qwen3.5-35B-A3B-FP8}"
MAX_MODEL_LEN="${MAX_MODEL_LEN:-8192}"

echo "=== Deploying Qwen 3.5 to RunPod ==="
echo "Pod name:    $POD_NAME"
echo "GPU:         $GPU_TYPE x$GPU_COUNT"
echo "Model:       $MODEL_ID"
echo "Max len:     $MAX_MODEL_LEN"
echo ""

# Check runpodctl is installed
if ! command -v runpodctl &>/dev/null; then
  echo "ERROR: runpodctl not found. Install from https://github.com/runpod/runpodctl"
  exit 1
fi

# Create the pod
runpodctl create pod \
  --name "$POD_NAME" \
  --gpuType "$GPU_TYPE" \
  --gpuCount "$GPU_COUNT" \
  --containerDiskSize "$CONTAINER_DISK" \
  --volumeSize "$VOLUME_SIZE" \
  --imageName "$IMAGE" \
  --ports "8000/http" \
  --env "MODEL_ID=$MODEL_ID" \
  --env "MAX_MODEL_LEN=$MAX_MODEL_LEN" \
  --args "python -m vllm.entrypoints.openai.api_server --model $MODEL_ID --max-model-len $MAX_MODEL_LEN --trust-remote-code --host 0.0.0.0 --port 8000"

echo ""
echo "=== Pod created ==="
echo "Wait for the model to download and load (~5-10 min for first run)."
echo "Check status with: runpodctl get pod"
echo ""
echo "Once running, your endpoint will be:"
echo "  https://<POD_ID>-8000.proxy.runpod.net"
echo ""
echo "Test with:"
echo "  curl https://<POD_ID>-8000.proxy.runpod.net/health"
