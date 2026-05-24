import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../app/components/ui/button';
import { Card, CardContent } from '../app/components/ui/card';
import { Input } from '../app/components/ui/input';
import { Label } from '../app/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { login, loginWithGoogle } from "../services/authService";

export function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const data = await loginWithGoogle(credentialResponse.credential);
      localStorage.setItem("token", data.token);
      toast.success("Login realizado com sucesso!");
      if (data.additionalDataCompleted === false) {
        navigate("/complete-profile");
      } else {
        navigate("/timelines");
      }
    } catch {
      toast.error("Falha ao autenticar com Google.");
    }
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email inválido';

    if (!password) newErrors.password = 'Senha é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const data = await login(email, password);
      localStorage.setItem("token", data.token);

      toast.success("Login realizado com sucesso!");
      navigate("/timelines");
    } catch (error) {
      toast.error("Email ou senha inválidos.");
      setErrors({ email: "Email ou senha inválidos" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f3eb] flex items-center justify-center px-4 relative">

      {/* 🔙 BOTÃO VOLTAR */}
      <button
        onClick={() => navigate("/")}
        className="
          absolute top-6 left-6
          flex items-center gap-2
          text-gray-600
          hover:text-black
          transition-all duration-200
          hover:scale-110
          active:scale-95
        "
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Voltar</span>
      </button>

      <div className="w-full max-w-md space-y-6">

        {/* Título */}
        <div className="text-center">
          <h1 className="text-2xl font-black text-gray-800">
            Guia do Viajante do Tempo
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Acesse sua jornada
          </p>
        </div>

        {/* Card */}
        <Card className="shadow-md border border-[#e5e0d6] rounded-2xl bg-white">
          <CardContent className="p-6 space-y-6">

            <h2 className="text-xl font-bold text-gray-800 text-center">
              Entrar
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className={`
                    mt-1
                    focus:ring-2 focus:ring-[#d6a84f]
                    ${errors.email ? 'border-red-500' : ''}
                  `}
                />

                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Senha */}
              <div>
                <Label htmlFor="password">Senha</Label>

                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`
                    mt-1
                    focus:ring-2 focus:ring-[#d6a84f]
                    ${errors.password ? 'border-red-500' : ''}
                  `}
                />

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Botão */}
              <Button
                type="submit"
                disabled={loading}
                className="
                  w-full py-5 text-sm font-bold
                  bg-[#d6a84f] hover:bg-[#c99b3f]
                  text-black
                  rounded-xl
                  transition-all duration-200
                  hover:scale-105
                  active:scale-95
                  shadow-sm hover:shadow-lg
                "
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    Entrando
                  </span>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            {/* Divisor */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#e5e0d6]" />
              <span className="text-xs text-gray-400 font-medium">ou</span>
              <div className="flex-1 h-px bg-[#e5e0d6]" />
            </div>

            {/* Google */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Falha ao autenticar com Google.")}
                text="signin_with"
                shape="rectangular"
              />
            </div>

            {/* Link */}
            <div className="text-center text-sm">
              <span className="text-gray-500">
                Não tem conta?
              </span>
              <button
                onClick={() => navigate('/register')}
                className="ml-1 text-[#a67c2e] font-semibold hover:underline"
              >
                Criar conta
              </button>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}