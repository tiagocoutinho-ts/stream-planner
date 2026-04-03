import { createUserWithEmailAndPassword, type AuthError } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

interface RegisterFormInputs {
  email: string;
  password: string;
  confirmPassword?: string; // Campo extra opcional para validação
}

export function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      alert("Conta criada com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      const firebaseError = error as AuthError;

      if (firebaseError.code === "auth/email-already-in-use") {
        alert("Este e-mail já está em uso.");
      } else {
        alert("Erro ao criar conta. Tente novamente.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md gi-2xl">
        <header className="text-center mb-8">
          <Link to={"/"}>
          <h1 className="text-3xl font-bold text-purple-500 font-mono tracking-tighter mb-2">
            StreamPlanner
          </h1>
          </Link>
          <h2 className="text-slate-400 text-sm">Crie sua conta gratuita</h2>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* CAMPO E-MAIL */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              E-mail
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              className={`w-full bg-slate-800 border ${
                errors.email ? "border-red-500" : "border-slate-700"
              } rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
              {...register("email", { required: "E-mail é obrigatório" })}
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
              placeholder="Mínimo 6 caracteres"
              className={`w-full bg-slate-800 border ${
                errors.password ? "border-red-500" : "border-slate-700"
              } rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
              {...register("password", {
                required: "Senha é obrigatória",
                minLength: { value: 6, message: "Mínimo de 6 caracteres" },
              })}
            />
            {errors.password && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* CONFIRMAÇÃO DE SENHA*/}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Confirmar Senha
            </label>
            <input
              type="password"
              placeholder="Repita sua senha"
              className={`w-full bg-slate-800 border ${
                errors.confirmPassword ? "border-red-500" : "border-slate-700"
              } rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
              {...register("confirmPassword", {
                validate: (value) =>
                  value === watch("password") || "As senhas não coincidem",
              })}
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg mt-4 transition-all active:scale-[0.98] shadow-lg shadow-purple-900/20"
          >
            Criar Minha Lista
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Já tem uma conta?{" "}
          <Link
            to="/entrar"
            className="text-purple-400 hover:text-purple-300 font-medium underline-offset-4 hover:underline"
          >
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
