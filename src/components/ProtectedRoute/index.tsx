import { useEffect, useState, type ReactNode } from "react"; // Adicionei ReactNode aqui
import { Navigate } from "react-router-dom";
import { onAuthStateChanged, type User } from "firebase/auth"; // Adicionei User aqui
import { auth } from "../../services/firebase";

// Definindo a interface para as props
interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Corrigindo o erro do setUser: precisamos dizer ao useState que ele aceita o tipo User ou null
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  if (!user) {
    return <Navigate to="/entrar" />;
  }

  return <>{children}</>; // Use o fragment <> para garantir retorno válido
}