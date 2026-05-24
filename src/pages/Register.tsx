import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../app/components/ui/button';
import { Card, CardContent } from '../app/components/ui/card';
import { Input } from '../app/components/ui/input';
import { Label } from '../app/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { register } from "../services/authService";

export function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    gender: '',
    userType: ''
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors: any = {};

    if (!form.name) newErrors.name = "Nome é obrigatório";

    if (!form.email) newErrors.email = "Email é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email inválido";

    if (!form.password) newErrors.password = "Senha é obrigatória";

    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "As senhas não coincidem";

    if (!form.userType)
      newErrors.userType = "Tipo de usuário é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        birthDate: form.birthDate || null,
        gender: form.gender || null,
        avatar: null,
        userType: form.userType
      });

      toast.success("Conta criada com sucesso! Faça login para continuar.");
      navigate("/login");
    } catch (error) {
      toast.error("Erro ao criar conta. Verifique os dados e tente novamente.");
      setErrors({ email: "Erro ao criar conta" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f3eb] flex items-center justify-center px-4 relative">

      {/* 🔙 VOLTAR */}
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

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-2xl font-black text-gray-800">
            Guia do Viajante do Tempo
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Comece sua jornada
          </p>
        </div>

        {/* CARD */}
        <Card className="shadow-md border border-[#e5e0d6] rounded-2xl bg-white">
          <CardContent className="p-6 space-y-6">

            <h2 className="text-xl font-bold text-gray-800 text-center">
              Criar conta
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Nome */}
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Seu nome completo"
                  className={`
                    mt-1
                    focus:ring-2 focus:ring-[#d6a84f]
                    ${errors.name ? 'border-red-500' : ''}
                  `}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="seu@email.com"
                  className={`
                    mt-1
                    focus:ring-2 focus:ring-[#d6a84f]
                    ${errors.email ? 'border-red-500' : ''}
                  `}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Senha */}
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="••••••••"
                  className={`
                    mt-1
                    focus:ring-2 focus:ring-[#d6a84f]
                    ${errors.password ? 'border-red-500' : ''}
                  `}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirmar senha */}
              <div>
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  placeholder="••••••••"
                  className={`
                    mt-1
                    focus:ring-2 focus:ring-[#d6a84f]
                    ${errors.confirmPassword ? 'border-red-500' : ''}
                  `}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Data nascimento */}
              <div>
                <Label htmlFor="birthDate">Data de nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => handleChange("birthDate", e.target.value)}
                  className="mt-1 focus:ring-2 focus:ring-[#d6a84f]"
                />
              </div>

              {/* Gênero */}
              <div>
                <Label>Gênero</Label>
                <select
                  value={form.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className="
                    mt-1 w-full
                    border rounded-md px-3 py-2
                    bg-white
                    focus:ring-2 focus:ring-[#d6a84f]
                  "
                >
                  <option value="">Selecione</option>
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMININO">Feminino</option>
                </select>
              </div>

              {/* Tipo de usuário */}
              <div>
                <Label>Tipo de usuário</Label>

                <select
                  value={form.userType}
                  onChange={(e) => handleChange("userType", e.target.value)}
                  className={`
      mt-1 w-full
      border rounded-md px-3 py-2
      bg-white
      focus:ring-2 focus:ring-[#d6a84f]
      ${errors.userType ? 'border-red-500' : ''}
    `}
                >

                  <option value="">
                    Selecione
                  </option>

                  <option value="STUDENT">
                    Estudante
                  </option>

                  <option value="TEACHER">
                    Professor
                  </option>

                </select>

                {
                  errors.userType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.userType}
                    </p>
                  )
                }
              </div>

              {/* BOTÃO */}
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
                    Criando conta
                  </span>
                ) : (
                  "Criar conta"
                )}
              </Button>
            </form>

            {/* LINK LOGIN */}
            <div className="text-center text-sm">
              <span className="text-gray-500">
                Já tem conta?
              </span>
              <button
                onClick={() => navigate("/login")}
                className="ml-1 text-[#a67c2e] font-semibold hover:underline"
              >
                Entrar
              </button>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}