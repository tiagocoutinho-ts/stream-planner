import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useState, useEffect } from "react";
import api from "../../services/tmdb";
import { db } from "../../services/firebase";
import { NavBar } from "../../components/NavBar";
import type { MovieTMDB, WatchlistItem } from "../../interfaces";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";

export function Dashboard() {
  const user = auth.currentUser;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<MovieTMDB[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "watchlist"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as WatchlistItem[];
      setWatchlist(items);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch(searchTerm);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = async (query: string): Promise<void> => {
    try {
      const response = await api.get("/search/multi", {
        params: {
          query: query,
          language: "pt-BR",
          include_adult: false,
        },
      });
      setResults(response.data.results);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    }
  };

  const handleAddToWatchlist = async (movie: MovieTMDB): Promise<void> => {
    if (!user) return alert("Ops! Logue novamente.");

    try {
      // Caminho: users -> SEU_ID -> watchlist -> NOVO_FILME
      const userListRef = collection(db, "users", user.uid, "watchlist");

      await addDoc(userListRef, {
        movieId: movie.id,
        title: movie.title || movie.name,
        posterPath: movie.poster_path,
        status: "backlog",
        priority: 3,
        createdAt: serverTimestamp(),
      });

      alert(`${movie.title || movie.name} foi para sua lista!`);
      setSearchTerm(""); // Limpa a busca para você ver sua lista (que faremos a seguir)
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const handleRemoveFromWatchlist = async (docId: string): Promise<void> => {

    if (!user) return;

    try {
      // users -> seuID -> watchlist -> ID_DO_FILME
      const movieDocRef = doc(db, "users", user.uid, "watchlist", docId);

      await deleteDoc(movieDocRef);
      // O onSnapshot vai perceber a mudança e atualizar a tela sozinho!
    } catch (error) {
      console.error("Erro ao remover filme:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      {/* NAVBAR */}
      <NavBar
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        handleLogout={handleLogout}
        user={user}
      />

      <main>
        {/* RESULTADOS DA BUSCA - Aparece apenas se houver pesquisa */}
        {searchTerm.length > 0 && (
          <section className="mb-12 animate-in fade-in duration-500">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {results.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 rounded-lg p-2 border border-slate-800 hover:border-purple-500 transition-all group"
                >
                  <div className="overflow-hidden rounded-md relative">
                    <img
                      src={
                        item.poster_path
                          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                          : "https://via.placeholder.com/500x750?text=Sem+Foto"
                      }
                      alt={item.title || item.name}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
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
        )}

        {/* MINHA LISTA - Aparece sempre ou esconde quando pesquisa */}
        <section className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold border-l-4 border-purple-500 pl-3">
              Minha Lista ({watchlist.length})
            </h2>
          </div>

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

                <h3 className="text-sm mt-2 font-medium truncate">
                  {movie.title}
                </h3>

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
        </section>
      </main>
    </div>
  );
}
