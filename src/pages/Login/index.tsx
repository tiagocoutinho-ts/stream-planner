import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; // Para redirecionar após o login

export function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // Aqui usamos o método de LOGIN
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      
      console.log("Usuário logado:", userCredential.user);
      
      // Após logar, mandamos o usuário para a página principal (Planner)
      navigate("/dashboard"); 
      
    } catch (error) {
      console.error("Erro:", error.code);
      
      // Tratamento de erro amigável
      if (error.code === "auth/invalid-credential") {
        alert("E-mail ou senha incorretos.");
      } else {
        alert("Erro ao fazer login. Tente novamente.");
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-xl font-bold">Entrar no StreamPlanner</h2>

        <input
          type="email"
          placeholder="E-mail"
          {...register("email", { required: "E-mail é obrigatório" })}
        />
        {errors.email && <span>{errors.email.message}</span>}

        <input
          type="password"
          placeholder="Senha"
          {...register("password", { required: "Senha é obrigatória" })}
        />
        {errors.password && <span>{errors.password.message}</span>}

        <button type="submit" >
          Entrar
        </button>
        
        <p>
          Não tem conta? <a href="/criar-conta">Cadastre-se</a>
        </p>
      </form>
    </div>
  );
}