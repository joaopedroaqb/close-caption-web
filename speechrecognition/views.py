import os
import json
import pyaudio
import threading
from django.http import JsonResponse
from vosk import Model, KaldiRecognizer
from django.shortcuts import render

# Caminho do modelo em português
model_path = r'C:\Users\joaop\Downloads\vosk-model-small-pt-0.3\vosk-model-small-pt-0.3'

# Verifica se o modelo existe
if not os.path.exists(model_path):
    raise Exception(f"O caminho especificado para o modelo não existe: {model_path}")

# Inicializa o modelo de reconhecimento de fala
model = Model(model_path)
recognizer = KaldiRecognizer(model, 16000)

# Inicializa PyAudio para captura de áudio
audio = pyaudio.PyAudio()
stream = audio.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=8192)
stream.start_stream()

caption_text = ""  # Armazenamento para as legendas

# Função para reconhecer fala e atualizar legenda
def update_caption():
    global caption_text
    while True:
        data = stream.read(8192, exception_on_overflow=False)
        if recognizer.AcceptWaveform(data):
            result = recognizer.Result()
            recognized_text = json.loads(result).get("text", "")
            caption_text += "\n" + recognized_text

# Inicia a thread para reconhecimento de fala
thread = threading.Thread(target=update_caption)
thread.daemon = True
thread.start()

def index(request):
    return render(request, 'speechrecognition/index.html')

def get_caption(request):
    global caption_text
    # Retorna o texto capturado como JSON para o frontend
    return JsonResponse({'caption': caption_text})
