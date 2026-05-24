import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../app/components/ui/button';
import { Card, CardContent } from '../app/components/ui/card';
import { Input } from '../app/components/ui/input';
import { Label } from '../app/components/ui/label';
import { completeProfile } from '../services/userService';

export function CompleteProfilePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    birthDate: '',
    gender: '',
    userType: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors: any = {};
    if (!form.birthDate) newErrors.birthDate = 'Data de nascimento é obrigatória';
    if (!form.gender) newErrors.gender = 'Gênero é obrigatório';
    if (!form.userType) newErrors.userType = 'Tipo de usuário é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await completeProfile({
        birthDate: form.birthDate,
        gender: form.gender,
        avatar: null,
        userType: form.userType,
      });
      toast.success('Perfil completo!');
      navigate('/timelines');
    } catch {
      toast.error('Erro ao completar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f3eb] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">

        <div className="text-center">
          <h1 className="text-2xl font-black text-gray-800">
            Guia do Viajante do Tempo
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Complete seu perfil para continuar
          </p>
        </div>

        <Card className="shadow-md border border-[#e5e0d6] rounded-2xl bg-white">
          <CardContent className="p-6 space-y-6">

            <h2 className="text-xl font-bold text-gray-800 text-center">
              Dados complementares
            </h2>

            <p className="text-sm text-gray-500 text-center">
              Precisamos de mais algumas informações para finalizar seu cadastro.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <Label htmlFor="birthDate">Data de nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => handleChange('birthDate', e.target.value)}
                  className={`mt-1 focus:ring-2 focus:ring-[#d6a84f] ${errors.birthDate ? 'border-red-500' : ''}`}
                />
                {errors.birthDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
                )}
              </div>

              <div>
                <Label>Gênero</Label>
                <select
                  value={form.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className={`mt-1 w-full border rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-[#d6a84f] ${errors.gender ? 'border-red-500' : ''}`}
                >
                  <option value="">Selecione</option>
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMININO">Feminino</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                )}
              </div>

              <div>
                <Label>Tipo de usuário</Label>
                <select
                  value={form.userType}
                  onChange={(e) => handleChange('userType', e.target.value)}
                  className={`mt-1 w-full border rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-[#d6a84f] ${errors.userType ? 'border-red-500' : ''}`}
                >
                  <option value="">Selecione</option>
                  <option value="STUDENT">Estudante</option>
                  <option value="TEACHER">Professor</option>
                </select>
                {errors.userType && (
                  <p className="text-red-500 text-sm mt-1">{errors.userType}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="
                  w-full py-5 text-sm font-bold
                  bg-[#d6a84f] hover:bg-[#c99b3f]
                  text-black rounded-xl
                  transition-all duration-200
                  hover:scale-105 active:scale-95
                  shadow-sm hover:shadow-lg
                "
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Salvando
                  </span>
                ) : (
                  'Salvar e continuar'
                )}
              </Button>
            </form>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
