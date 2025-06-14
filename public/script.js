async function fetchVoices() {
  try {
    const res = await fetch('/voices');
    const data = await res.json();
    const select = document.getElementById('voice');
    data.voices.forEach(v => {
      const option = document.createElement('option');
      option.value = v.voice_id;
      option.textContent = v.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.error('Failed to load voices', err);
  }
}

async function speak() {
  const text = document.getElementById('text').value;
  const voice = document.getElementById('voice').value;
  const model = document.getElementById('model').value;
  const res = await fetch('/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voiceId: voice, modelId: model })
  });
  const blob = await res.blob();
  const audio = document.getElementById('audio');
  audio.src = URL.createObjectURL(blob);
  audio.play();
}

document.getElementById('speak').addEventListener('click', speak);

fetchVoices();
