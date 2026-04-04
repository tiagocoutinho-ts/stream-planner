import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { query } = req.query; // Pega o termo de busca enviado pelo front

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const response = await axios.get("https://api.themoviedb.org/3/search/multi", {
      params: {
        query: query,
        language: "pt-BR",
        include_adult: false,
      },
      headers: {
        // O TOKEN FICA AQUI, NO SERVIDOR
        Authorization: `Bearer ${process.env.VITE_TMDB_TOKEN}`, 
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar dados do TMDB' });
  }
}