import type { WatchlistItem } from "../../interfaces";

interface CardWatchListProps {
  watchlist: WatchlistItem[]
  handleRemoveFromWatchlist: (id: string) => void
}

export function CardWatchList({watchlist, handleRemoveFromWatchlist}: CardWatchListProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {watchlist.map((movie) => (
        <div
          key={movie.id}
          className="bg-slate-900 rounded-lg p-2 border border-slate-800 relative group"
        >
          {/* Botão de Remover (X) no topo do card */}
          <button
            onClick={() => handleRemoveFromWatchlist(movie.id)}
            className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
            title="Remover da lista"
          >
            ✕
          </button>

          <img
            src={
              movie.posterPath
                ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
                : "https://via.placeholder.com/500x750?text=Sem+Foto"
            }
            alt={movie.title}
            className="rounded-md w-full h-auto"
          />

          <h3 className="text-sm mt-2 font-medium truncate">{movie.title}</h3>

          <a
            href={`https://www.justwatch.com/br/busca?q=${encodeURIComponent(
              movie.title
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full mt-2 bg-slate-800 hover:bg-slate-700 text-[10px] text-center py-1 rounded transition-colors"
          >
            📺 Onde assistir?
          </a>
        </div>
      ))}
    </div>
  );
}
