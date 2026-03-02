FROM vllm/vllm-openai:latest

ENV MODEL_ID=Qwen/Qwen3.5-35B-A3B-FP8
ENV HOST=0.0.0.0
ENV PORT=8000
ENV MAX_MODEL_LEN=8192
ENV TENSOR_PARALLEL_SIZE=1
ENV HUGGINGFACE_TOKEN=""

EXPOSE 8000

COPY server.py /app/server.py
COPY requirements.txt /app/requirements.txt

WORKDIR /app

RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "server.py"]
