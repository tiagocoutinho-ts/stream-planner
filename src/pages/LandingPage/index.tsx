import { Link } from "react-router-dom";
// CORREÇÃO: Import padrão sem chaves para arquivos de imagem
import ListImg from "../../assets/my-list-lading-page.png"; 
import { Film, List, Search, ArrowRight } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 py-6 border-b border-slate-900 max-w-7xl mx-auto">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent font-mono">
          StreamPlanner
        </h1>
        <div className="flex gap-6 items-center">
          <Link to="/entrar" className="text-sm hover:text-white transition-colors">
            Entrar
          </Link>
          <Link to="/criar-conta" className="text-sm bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-slate-200 transition-all">
            Começar agora
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <span className="inline-block px-3 py-1 rounded-full border border-purple-500/30 text-purple-400 text-xs font-medium mb-6">
          Sua watchlist, simplificada.
        </span>

        <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8">
          Organize sua jornada <br />
          <span className="text-slate-500 font-light">cinematográfica.</span>
        </h2>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
          Chega de perder tempo decidindo o que assistir. Pesquise e gerencie seus 
          filmes e séries favoritos em uma interface minimalista.
        </p>

        <div className="flex justify-center mb-20">
          <Link
            to="/criar-conta"
            className="group bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all flex items-center gap-2 shadow-lg shadow-purple-900/20"
          >
            Criar minha lista gratuita
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* MOCKUP DA IMAGEM - Responsivo e com efeito */}
        <div className="relative max-w-4xl mx-auto px-4">
          {/* Efeito de brilho ao fundo */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20"></div>
          
          <div className="relative bg-slate-900 rounded-2xl border border-slate-800 p-2 shadow-2xl">
            <img 
              src={ListImg} 
              alt="Preview do App" 
              className="rounded-xl w-full h-auto object-cover border border-slate-700/50"
            />
          </div>
        </div>
      </main>

      {/* FEATURES */}
      <section className="border-t border-slate-900 py-24 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <div className="group space-y-4 p-6 rounded-2xl border border-transparent hover:border-slate-800 hover:bg-slate-900/30 transition-all">
            <div className="w-10 h-10 rounded-lg border border-slate-800 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
              <Search size={20} />
            </div>
            <h3 className="text-xl font-semibold text-white">Pesquisa Inteligente</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              Acesso instantâneo a milhões de títulos com dados atualizados do TMDB.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group space-y-4 p-6 rounded-2xl border border-transparent hover:border-slate-800 hover:bg-slate-900/30 transition-all">
            <div className="w-10 h-10 rounded-lg border border-slate-800 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
              <List size={20} />
            </div>
            <h3 className="text-xl font-semibold text-white">Organização Fluida</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              Adicione itens à sua watchlist com um clique e nunca mais esqueça um filme.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group space-y-4 p-6 rounded-2xl border border-transparent hover:border-slate-800 hover:bg-slate-900/30 transition-all">
            <div className="w-10 h-10 rounded-lg border border-slate-800 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
              <Film size={20} />
            </div>
            <h3 className="text-xl font-semibold text-white">Onde assistir?</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              Descubra em tempo real quais plataformas de streaming possuem o título.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-900 text-center">
        <p className="text-slate-600 text-xs">
          © 2026 StreamPlanner. Powered by TMDB API.
        </p>
      </footer>
    </div>
  );
}