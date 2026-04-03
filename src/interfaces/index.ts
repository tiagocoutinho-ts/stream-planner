export interface MovieTMDB {
  id: number;
  title?: string;
  name?: string; // Para séries
  poster_path: string | null;
}

export interface WatchlistItem {
  id: string;
  movieId: number;
  title: string;
  posterPath: string | null;
  status: string;
  priority: number;
  createdAt: any; 
}

