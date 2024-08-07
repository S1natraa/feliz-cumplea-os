// script.js

async function init() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const mediaStreamSource = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        mediaStreamSource.connect(analyser);

        analyser.fftSize = 2048; // Incrementamos el tamaño de FFT para mayor precisión
        const bufferLength = analyser.fftSize;
        const dataArray = new Uint8Array(bufferLength);

        function detectBlow() {
            analyser.getByteTimeDomainData(dataArray);
            let maxVolume = 0;
            for (let i = 0; i < bufferLength; i++) {
                const currentVolume = Math.abs(dataArray[i] - 128);
                if (currentVolume > maxVolume) {
                    maxVolume = currentVolume;
                }
            }

            if (maxVolume > 40) { // Ajustamos este valor para mayor sensibilidad
                const flame = document.querySelector('.flame');
                if (!flame.classList.contains('off')) {
                    flame.classList.add('off');
                }
            }

            requestAnimationFrame(detectBlow);
        }

        detectBlow();
    } catch (err) {
        console.error('Error accessing microphone:', err);
    }
}

document.getElementById('play-button').addEventListener('click', () => {
    const audio = document.getElementById('background-music');
    const video = document.getElementById('birthday-video');
    audio.play();
    video.style.display = 'block';
    video.play();

    audio.onended = () => {
        const message = document.getElementById('message');
        message.style.display = 'block';
    };
});

init();
