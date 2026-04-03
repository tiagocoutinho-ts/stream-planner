import { signInWithEmailAndPassword, type AuthError } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

interface LoginFormInputs {
  email: string;
  password: string;
}

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const navigate = useNavigate();

  // O SubmitHandler garante que o 'data' tenha email e password
  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate("/dashboard");
    } catch (error) {
      // Tipamos o erro como AuthError do Firebase
      const firebaseError = error as AuthError;

      if (firebaseError.code === "auth/invalid-credential") {
        alert("E-mail ou senha incorretos.");
      } else {
        alert("Erro ao fazer login. Tente novamente.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-950 p-8 border-slate-800 shadow-xl">
        <header className="text-center mb-8">
          <Link to={"/"}>
            <h1 className="text-3xl font-bold text-purple-500 font-mono tracking-tighter mb-2">
              StreamPlanner
            </h1>
          </Link>
          <h2 className="text-slate-400 text-sm">Entrar na sua conta</h2>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* CAMPO E-MAIL */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              E-mail
            </label>
            <input
              type="email"
              placeholder="exemplo@email.com"
              className={`w-full bg-slate-800 border ${
                errors.email ? "border-red-500" : "border-slate-700"
              } rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
              {...register("email", { required: "O e-mail é obrigatório" })}
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* CAMPO SENHA */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className={`w-full bg-slate-800 border ${
                errors.password ? "border-red-500" : "border-slate-700"
              } rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
              {...register("password", { required: "A senha é obrigatória" })}
            />
            {errors.password && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-purple-900/20"
          >
            Entrar
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Não tem conta?{" "}
          <Link
            to="/criar-conta"
            className="text-purple-400 hover:text-purple-300 font-medium underline-offset-4 hover:underline"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
