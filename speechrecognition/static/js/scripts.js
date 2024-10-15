// Variável para armazenar o reconhecimento de fala
let recognition;
let recognizing = false;

// Função para iniciar a câmera
function startVideoStream() {
    const video = document.getElementById('video-stream');
    
    // Acessa a câmera do usuário
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            video.srcObject = stream;
        })
        .catch(function(error) {
            console.error("Erro ao acessar a câmera: ", error);
        });
}

// Função para iniciar o reconhecimento de fala continuamente
function startSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Este navegador não suporta reconhecimento de fala. Use o Google Chrome.");
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.lang = 'pt-BR';  // Definir o idioma para português
    recognition.continuous = true;  // Para capturar fala continuamente
    recognition.interimResults = true;  // Exibe resultados intermediários

    recognition.onstart = function() {
        recognizing = true;
        console.log("Reconhecimento de fala iniciado.");
    };

    recognition.onresult = function(event) {
        let transcript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                transcript += event.results[i][0].transcript + '<br>'; // Adiciona quebra de linha
            }
        }

        // Atualizar o texto da legenda
        document.getElementById('caption-display').innerHTML += transcript;
        document.getElementById('caption-display').scrollTop = document.getElementById('caption-display').scrollHeight;
    };

    recognition.onerror = function(event) {
        console.error("Erro no reconhecimento de fala: ", event.error);
        // Reinicia o reconhecimento de fala em caso de erro
        recognition.stop();
        startSpeechRecognition();
    };

    recognition.onend = function() {
        recognizing = false;
        console.log("Reconhecimento de fala finalizado.");
        // Reinicia automaticamente o reconhecimento de fala ao final
        startSpeechRecognition();
    };

    recognition.start();
}

// Carrega o vídeo e inicia o reconhecimento de fala assim que a página é carregada
window.onload = function() {
    startVideoStream();
    startSpeechRecognition();  // Inicia automaticamente o reconhecimento de fala
};
