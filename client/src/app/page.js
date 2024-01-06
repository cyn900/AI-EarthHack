'use client'

// ./src/app/page.js
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSendPrompt = async(e) => {
      e.preventDefault();

      try {
          const response = await axios.get('http://localhost:5000/healthcheck');
          console.log(response.data);

          setResponse(prompt + " running... backend status: " + response.data.status);
      } catch (error) {
          console.error('Error sending prompt:', error);
      }
  };

  return (
      <div>
        <h1>ChatGPT App</h1>
        <div>
          <label>Enter your prompt:</label>
          <input type="text" value={prompt} onChange={handlePromptChange} />
          <button onClick={handleSendPrompt}>Send Prompt</button>
        </div>
        <div>
          <p>Response:</p>
          <p>{response}</p>
        </div>
      </div>
  );
}
