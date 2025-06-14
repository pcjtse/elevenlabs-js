let recognition = null;
let isRecording = false;

// Initialize speech recognition
function initSpeechRecognition() {
  if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcription = document.getElementById('transcription');
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      transcription.innerHTML = finalTranscript + '<i style="color: #999">' + interimTranscript + '</i>';
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      stopRecording();
    };
  } else {
    console.error('Speech recognition not supported');
    document.getElementById('startRecording').disabled = true;
  }
}

// Voice selection and playback functions
async function fetchVoices() {
  try {
    const res = await fetch('/voices');
    if (!res.ok) throw new Error('Failed to fetch voices');
    
    const data = await res.json();
    const select = document.getElementById('voice');
    select.innerHTML = ''; // Clear existing options
    
    data.voices.forEach(voice => {
      const option = document.createElement('option');
      option.value = voice.voice_id;
      option.textContent = voice.name;
      select.appendChild(option);
    });

    // Enable the speak button once voices are loaded
    document.getElementById('speak').disabled = false;
  } catch (err) {
    console.error('Failed to load voices:', err);
    alert('Failed to load voices. Please try refreshing the page.');
  }
}

async function speak(text = null) {
  const textToSpeak = text || document.getElementById('text').value;
  if (!textToSpeak.trim()) {
    alert('Please enter some text or speak into the microphone');
    return;
  }

  const voice = document.getElementById('voice').value;
  const model = document.getElementById('model').value;

  try {
    const res = await fetch('/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: textToSpeak, 
        voiceId: voice, 
        modelId: model 
      })
    });

    if (!res.ok) throw new Error('Failed to generate speech');

    const blob = await res.blob();
    const audio = document.getElementById('audio');
    const audioUrl = URL.createObjectURL(blob);
    
    // Clean up old URL if it exists
    if (audio.src) {
      URL.revokeObjectURL(audio.src);
    }
    
    audio.src = audioUrl;
    await audio.play();
  } catch (err) {
    console.error('Failed to generate speech:', err);
    alert('Failed to generate speech. Please try again.');
  }
}

// Recording control functions
function startRecording() {
  if (!recognition) return;
  
  isRecording = true;
  recognition.start();
  
  document.getElementById('startRecording').disabled = true;
  document.getElementById('stopRecording').disabled = false;
  document.getElementById('recordingIndicator').classList.add('active');
}

function stopRecording() {
  if (!recognition) return;
  
  isRecording = false;
  recognition.stop();
  
  document.getElementById('startRecording').disabled = false;
  document.getElementById('stopRecording').disabled = true;
  document.getElementById('recordingIndicator').classList.remove('active');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  initSpeechRecognition();
  fetchVoices();
  
  document.getElementById('speak').addEventListener('click', () => speak());
  document.getElementById('startRecording').addEventListener('click', startRecording);
  document.getElementById('stopRecording').addEventListener('click', stopRecording);
  
  // Convert transcribed text to speech when recording stops
  if (recognition) {
    recognition.onend = () => {
      const transcription = document.getElementById('transcription').textContent;
      if (transcription.trim()) {
        speak(transcription);
      }
    };
  }
});
