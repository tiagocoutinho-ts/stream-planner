import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";

export function Register() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log("Usuário logado:", userCredential.user);
      alert("Sucesso!");
      navigate("/dashboard")
    } catch (error) {
      console.error("Erro:", error.code);
      alert("Erro ao criar conta.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Criar Conta</h2>

        {/* Campo E-mail */}
        <input
          type="email"
          placeholder="Seu e-mail"
          className="border p-2 rounded"
          {...register("email", { required: "E-mail é obrigatório" })}
        />
        {errors.email && <span>{errors.email.message}</span>}

        {/* Campo Senha */}
        <input
          type="password"
          placeholder="Sua senha"
          className="border p-2 rounded"
          {...register("password", {
            required: "Senha é obrigatória",
            minLength: { value: 6, message: "Mínimo de 6 caracteres" },
          })}
        />
        {errors.password && <span>{errors.password.message}</span>}

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Cadastrar
        </button>
        <p>
          Já tem conta? <a href="/entrar">Entrar</a>
        </p>
      </form>
    </div>
  );
}
