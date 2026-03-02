"""
vLLM OpenAI-compatible server for Qwen 3.5-35B-A3B-FP8.
Wraps the official vLLM entrypoint with environment-based configuration.
"""

import os
import uvicorn
from vllm.entrypoints.openai.cli_args import make_arg_parser

MODEL_ID = os.environ.get("MODEL_ID", "Qwen/Qwen3.5-35B-A3B-FP8")
HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", "8000"))
MAX_MODEL_LEN = int(os.environ.get("MAX_MODEL_LEN", "8192"))
TENSOR_PARALLEL_SIZE = int(os.environ.get("TENSOR_PARALLEL_SIZE", "1"))

HF_TOKEN = os.environ.get("HUGGINGFACE_TOKEN", "")
if HF_TOKEN:
    os.environ["HF_TOKEN"] = HF_TOKEN

def main():
    args_list = [
        "--model", MODEL_ID,
        "--host", HOST,
        "--port", str(PORT),
        "--max-model-len", str(MAX_MODEL_LEN),
        "--tensor-parallel-size", str(TENSOR_PARALLEL_SIZE),
        "--trust-remote-code",
    ]

    parser = make_arg_parser()
    args = parser.parse_args(args_list)

    print(f"Starting vLLM server:")
    print(f"  Model: {MODEL_ID}")
    print(f"  Host:  {HOST}:{PORT}")
    print(f"  Max model len: {MAX_MODEL_LEN}")
    print(f"  Tensor parallel: {TENSOR_PARALLEL_SIZE}")

    uvicorn.run(
        "vllm.entrypoints.openai.api_server:app",
        host=HOST,
        port=PORT,
        log_level="info",
    )

if __name__ == "__main__":
    main()
