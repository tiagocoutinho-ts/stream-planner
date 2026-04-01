import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";

export function Dashboard() {
  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div>
      <h1>Bem-vindo, {user?.email}</h1>

      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}