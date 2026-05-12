import client from './client';

export const uploadMedia = async (formData) => {
  try {
    const response = await client.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Increase Timeout to 10 Minutes (600,000 ms)
      // Ye zaroori hai taaki "Network Error" na aaye
      timeout: 600000, 
    });
    return response.data;
  } catch (error) {
    console.error("Upload Failed:", error);
    throw error;
  }
};