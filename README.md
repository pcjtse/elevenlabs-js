# ElevenLabs Voice Changer

A web application that allows users to convert text to speech and modify their voice using the ElevenLabs API. The application supports both text input and voice input, with real-time voice conversion capabilities.

## Features

- **Text-to-Speech Conversion**: Convert written text to natural-sounding speech
- **Voice Input**: Speak into your microphone and convert your voice in real-time
- **Voice Selection**: Choose from multiple ElevenLabs voices
- **Model Selection**: Support for both monolingual and multilingual models
- **Real-time Transcription**: See your speech transcribed as you speak
- **Emotion Support**: Maintain emotional context in the converted speech
- **Modern UI**: Clean and intuitive user interface

## Prerequisites

- Node.js (v14 or higher)
- An ElevenLabs API key (get one from [ElevenLabs](https://elevenlabs.io))

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd elevenlabs-js
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   - Create a new file named `.env` in the root directory
   - Add your ElevenLabs API key to the file:
     ```
     ELEVENLABS_API_KEY=your_api_key_here
     ```
   - Optional: Set a custom port (default is 3000):
     ```
     PORT=3000
     ```

   Note: The application will check for the `.env` file and validate the API key on startup. If the file is missing or the API key is invalid, you'll see helpful error messages.

## Usage

1. Start the server:
   ```bash
   node server.js
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

3. Using the application:
   - **Text Input**:
     1. Enter text in the text area
     2. Select a voice from the dropdown
     3. Choose a model (monolingual or multilingual)
     4. Click "Convert to Speech"

   - **Voice Input**:
     1. Click "Start Recording"
     2. Speak into your microphone
     3. Click "Stop Recording"
     4. The application will automatically convert your speech

## Technical Details

- **Frontend**: Vanilla JavaScript with Web Speech API for voice recognition
- **Backend**: Node.js with Express
- **API**: ElevenLabs Text-to-Speech API
- **Audio Processing**: Stream-based audio handling for efficient playback

## Browser Support

The application uses the Web Speech API for voice recognition, which is supported in:
- Chrome (recommended)
- Edge
- Safari (limited support)
- Firefox (limited support)

## Error Handling

The application includes comprehensive error handling for:
- API connection issues
- Voice recognition errors
- Audio playback problems
- Missing or invalid API keys
- Environment configuration issues

## Contributing

Feel free to submit issues and enhancement requests!
