import type { User } from "firebase/auth";

interface NavBarProps {
  setSearchTerm: (value: string) => void
  searchTerm: string
  handleLogout: () => Promise<void>
  user: User | null 
}

export function NavBar({setSearchTerm, searchTerm, handleLogout, user}: NavBarProps) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12 border-b border-slate-800 pb-6">
      <h1 className="text-2xl font-bold text-purple-500 font-mono tracking-tighter">
        StreamPlanner
      </h1>

      <div className="relative w-full md:w-1/3">
        <input
          type="text"
          placeholder="Pesquisar filmes ou séries..."
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-400">{user?.email}</span>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition-all"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
