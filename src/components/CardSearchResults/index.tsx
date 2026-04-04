import type { MovieTMDB } from "../../interfaces";
import { MoviePoster } from "./MoviePoster";

interface CardSearchProps {
  results: MovieTMDB[];
  handleAddToWatchlist: (movie: MovieTMDB) => void;
}
export function CardSearchResults({
  results,
  handleAddToWatchlist,
}: CardSearchProps) {
  return (
    <section className="mb-12 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {results.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 rounded-lg p-2 border border-slate-800 hover:border-purple-500 transition-all group flex flex-col"
          >
            {/* Usando o novo componente de imagem */}
            <MoviePoster
              path={item.poster_path}
              alt={item.title || item.name || "Filme"}
            />

            <h3 className="text-sm mt-3 font-medium truncate">
              {item.title || item.name}
            </h3>

            <button
              className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 rounded font-semibold transition-colors"
              onClick={() => handleAddToWatchlist(item)}
            >
              + Adicionar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
