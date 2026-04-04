import { Clapperboard } from "lucide-react";

interface MoviePosterProps {
  path: string | null;
  alt: string;
}

export function MoviePoster({ path, alt }: MoviePosterProps) {
  return (
    <div className="overflow-hidden rounded-md relative aspect-[2/3] bg-slate-800 border border-slate-800/50">
      {path ? (
        <img
          src={`https://image.tmdb.org/t/p/w500${path}`}
          alt={alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
            (e.target as HTMLImageElement).parentElement!.classList.add(
              "bg-slate-800"
            );
          }}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-800 text-slate-600">
          <Clapperboard className="w-10 h-10 mb-2 opacity-20" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-center">
            Sem Imagem
          </span>
        </div>
      )}
    </div>
  );
}
