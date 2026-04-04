import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useState, useEffect } from "react";
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
import { CardSearchResults } from "../../components/CardSearchResults";
import { CardWatchList } from "../../components/CardWatchList";

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
      const response = await fetch(`/api/movies?query=${encodeURIComponent(query)}`);
      const data = await response.json()
      setResults(data.results);
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
        {/* Se houver pesquisa, mostra os resultados */}
        {searchTerm.length > 0 ? (
          <CardSearchResults
            results={results}
            handleAddToWatchlist={handleAddToWatchlist}
          />
        ) : (
          /* Se NÃO houver pesquisa, mostra a "Minha Lista" */
          <section className="mt-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold border-l-4 border-purple-500 pl-3">
                Minha Lista ({watchlist.length})
              </h2>
            </div>

            <CardWatchList
              watchlist={watchlist}
              handleRemoveFromWatchlist={handleRemoveFromWatchlist}
            />
          </section>
        )}
      </main>
    </div>
  );
}
