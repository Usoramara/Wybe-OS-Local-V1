#!/usr/bin/env bash
set -euo pipefail

# Deploy Qwen 3.5-35B-A3B on RunPod H100 NVL via SGLang
# Requires: runpodctl CLI (https://github.com/runpod/runpodctl)

POD_NAME="${POD_NAME:-wybe-os-local-qwen}"
GPU_TYPE="${GPU_TYPE:-NVIDIA H100 NVL}"
GPU_COUNT="${GPU_COUNT:-1}"
CONTAINER_DISK="${CONTAINER_DISK:-50}"
VOLUME_SIZE="${VOLUME_SIZE:-150}"
IMAGE="${IMAGE:-lmsysorg/sglang:latest}"
MODEL_ID="${MODEL_ID:-Qwen/Qwen3.5-35B-A3B}"

echo "=== Deploying Qwen 3.5 to RunPod ==="
echo "Pod name:    $POD_NAME"
echo "GPU:         $GPU_TYPE x$GPU_COUNT"
echo "Model:       $MODEL_ID"
echo "Server:      SGLang"
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
  --env "HF_HOME=/runpod/huggingface" \
  --env "HUGGINGFACE_HUB_CACHE=/runpod/huggingface/hub"

echo ""
echo "=== Pod created ==="
echo ""
echo "SSH into the pod and run:"
echo "  export HF_HOME=/runpod/huggingface"
echo "  export HUGGINGFACE_HUB_CACHE=/runpod/huggingface/hub"
echo "  pip install sglang[all] --find-links https://flashinfer.ai/whl/cu128/torch2.9/flashinfer-python/"
echo "  python -m sglang.launch_server --model-path $MODEL_ID --host 0.0.0.0 --port 8000 --mem-fraction-static 0.85"
echo ""
echo "Check status with: runpodctl get pod"
echo ""
echo "Once running, your endpoint will be:"
echo "  https://<POD_ID>-8000.proxy.runpod.net"
echo ""
echo "Test with:"
echo "  curl https://<POD_ID>-8000.proxy.runpod.net/v1/models"
