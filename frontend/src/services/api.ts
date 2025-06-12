const API_URL = '/api';

export const api = {
  async getWelcomeMessage() {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }
}; 