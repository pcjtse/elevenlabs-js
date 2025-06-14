const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ELEVENLABS_API_KEY;

app.use(express.json());
app.use(express.static('public'));

app.get('/voices', async (req, res) => {
  try {
    const r = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': API_KEY }
    });
    const data = await r.json();
    res.json({ voices: data.voices || [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch voices' });
  }
});

app.post('/tts', async (req, res) => {
  const { text, voiceId, modelId } = req.body;
  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text, model_id: modelId })
    });

    if (!r.ok) throw new Error('API error');
    const buffer = await r.arrayBuffer();
    res.set('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: 'Failed to synthesize speech' });
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
