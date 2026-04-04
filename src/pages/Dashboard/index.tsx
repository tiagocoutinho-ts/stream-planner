import { signOut, onAuthStateChanged, type User } from "firebase/auth"; // Adicionei User e onAuthStateChanged
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
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<MovieTMDB[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  // 2. Escutar mudanças na autenticação (Essencial para não travar)
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  // 3. Buscar a Watchlist quando o usuário estiver pronto
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

  // 4. Busca com Debounce
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
      
      // Se a API falhar (404/500), evita travar o app
      if (!response.ok) {
        console.error("Erro na API da Vercel");
        return;
      }

      const data = await response.json();
      // Garante que results seja sempre um array, mesmo que venha vazio
      setResults(data.results || []);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
      setResults([]);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleAddToWatchlist = async (movie: MovieTMDB): Promise<void> => {
    if (!user) return alert("Ops! Logue novamente.");

    try {
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
      setSearchTerm(""); 
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const handleRemoveFromWatchlist = async (docId: string): Promise<void> => {
    if (!user) return;
    try {
      const movieDocRef = doc(db, "users", user.uid, "watchlist", docId);
      await deleteDoc(movieDocRef);
    } catch (error) {
      console.error("Erro ao remover filme:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <NavBar
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        handleLogout={handleLogout}
        user={user}
      />

      <main className="max-w-7xl mx-auto">
        {searchTerm.length > 0 ? (
          <CardSearchResults
            results={results}
            handleAddToWatchlist={handleAddToWatchlist}
          />
        ) : (
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