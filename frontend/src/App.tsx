import { useState, useEffect } from 'react'
import './App.css'
import { api } from './services/api'

function App() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const data = await api.getWelcomeMessage();
        setMessage(data.message);
      } catch (error) {
        console.error('Error fetching message:', error);
        setMessage('Error connecting to the server');
      }
    };

    fetchMessage();
  }, []);

  return (
    <div className="App">
      <h1>Train Tracking App</h1>
      <p>{message}</p>
    </div>
  )
}

export default App
