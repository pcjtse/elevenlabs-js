import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('Error: .env file not found!');
  console.error('Please create a .env file in the root directory with your ELEVENLABS_API_KEY');
  process.exit(1);
}

dotenv.config();

// Validate API key
const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('Error: ELEVENLABS_API_KEY is not set in .env file!');
  console.error('Please add your API key to the .env file:');
  console.error('ELEVENLABS_API_KEY=your_api_key_here');
  process.exit(1);
}

if (API_KEY.length < 32) {
  console.error('Error: Invalid ELEVENLABS_API_KEY format!');
  console.error('The API key should be a valid ElevenLabs API key');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.get('/voices', async (req, res) => {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 
        'xi-api-key': API_KEY,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API responded with status: ${response.status}`);
    }

    const data = await response.json();
    res.json({ voices: data.voices || [] });
  } catch (err) {
    console.error('Failed to fetch voices:', err);
    res.status(500).json({ error: 'Failed to fetch voices from ElevenLabs API' });
  }
});

app.post('/tts', async (req, res) => {
  const { text, voiceId, modelId } = req.body;

  if (!text || !voiceId || !modelId) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({ 
        text,
        model_id: modelId,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API responded with status: ${response.status}`);
    }

    // Set appropriate headers for streaming
    res.set({
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked'
    });

    // Stream the response
    response.body.pipe(res);
  } catch (err) {
    console.error('Failed to synthesize speech:', err);
    res.status(500).json({ error: 'Failed to generate speech from ElevenLabs API' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});
