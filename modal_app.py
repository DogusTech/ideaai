import modal
from fastapi import FastAPI
from pydantic import BaseModel

# FastAPI uygulamasını başlatıyoruz
web_app = FastAPI(title="IdeaAI Llama-3 API")

# Modal için gerekli kütüphanelerin (vLLM ve HuggingFace) bulunduğu imajı tanımlıyoruz
vllm_image = modal.Image.from_registry("nvidia/cuda:12.4.1-devel-ubuntu22.04", add_python="3.11").pip_install(
    "vllm",
    "huggingface_hub",
    "hf-transfer" # Hızlı indirme için
).env({"HF_HUB_ENABLE_HF_TRANSFER": "1"})

app = modal.App("ideaai-llama3-endpoint")

# Next.js'den gelecek verinin yapısı (Instruction ve Input)
class GenerateRequest(BaseModel):
    instruction: str
    input: str

# Model Sınıfı (GPU üzerinde çalışacak olan ağır kısım)
@app.cls(gpu="A10G", image=vllm_image, scaledown_window=300, timeout=600)
class IdeaAIModel:
    @modal.enter()
    def load(self):
        from vllm import LLM
        from vllm.lora.request import LoRARequest
        from huggingface_hub import snapshot_download
        
        print("LoRA ağırlıkları (DogusTech) indiriliyor...")
        self.lora_path = snapshot_download(repo_id="DogusTech/IdeaAI-Llama3-Elite")
        
        print("Llama-3 taban modeli yükleniyor...")
        # unsloth tabanı herkese açık olduğu için token gerektirmez
        self.llm = LLM(
            model="unsloth/llama-3-8b-Instruct",
            enable_lora=True,
            max_lora_rank=32,
            max_model_len=2048,
            enforce_eager=True
        )
        self.lora_request = LoRARequest("elite_lora", 1, self.lora_path)
        print("Model başarıyla yüklendi!")

    @modal.method()
    def generate(self, prompt: str):
        from vllm import SamplingParams
        # Yanıt parametreleri
        sampling_params = SamplingParams(temperature=0.3, max_tokens=1024)
        
        outputs = self.llm.generate(
            [prompt], 
            sampling_params=sampling_params,
            lora_request=self.lora_request
        )
        return outputs[0].outputs[0].text

# Web API Uç Noktası (Next.js'nin istek atacağı hafif CPU kısmı)
@app.function(image=vllm_image, timeout=600)
@modal.asgi_app()
def fastapi_app():
    @web_app.post("/generate")
    def generate(req: GenerateRequest):
        # Eğittiğimiz Alpaca Formatına uygun olarak Prompt'u birleştiriyoruz
        prompt = f"""Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

### Instruction:
{req.instruction}

### Input:
{req.input}

### Response:
"""
        # GPU'yu uyandırıp işlemi yaptırıyoruz
        model = IdeaAIModel()
        response_text = model.generate.remote(prompt)
        
        return {"response": response_text}
        
    return web_app
