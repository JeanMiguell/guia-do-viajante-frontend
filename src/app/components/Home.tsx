import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { BookOpen, Info, Sparkles, Award, Target } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

export function Home() {
  const navigate = useNavigate();
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-green-400 via-blue-400 to-purple-500">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-300 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-300 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-blue-300 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-green-300 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        <div className="max-w-4xl w-full text-center space-y-8">
          {/* Logo with Animation */}
          <div className="flex justify-center mb-6">
            <div className="relative animate-bounce" style={{ animationDuration: '2s' }}>
              <div className="bg-white p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform">
                <div className="bg-gradient-to-br from-green-400 to-green-600 p-6 rounded-2xl">
                  <BookOpen className="w-20 h-20 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg animate-pulse">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 text-white drop-shadow-lg">
              Guia do Viajante do Tempo
            </h1>
            <p className="text-xl md:text-2xl text-white font-semibold drop-shadow-md max-w-2xl mx-auto">
              Aprenda história do Brasil de forma divertida! 🎉
            </p>
            <p className="text-lg md:text-xl text-white opacity-90 mt-3 max-w-2xl mx-auto">
              Explore eventos históricos, conheça personagens incríveis e teste seus conhecimentos!
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-4 shadow-lg transform hover:scale-105 transition-all">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-800 text-sm">Aprenda Interativo</h3>
              <p className="text-xs text-gray-600 mt-1">Explore cenários e descubra fatos</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-lg transform hover:scale-105 transition-all">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-800 text-sm">Desafios Divertidos</h3>
              <p className="text-xs text-gray-600 mt-1">Responda quizzes e ganhe pontos</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-lg transform hover:scale-105 transition-all">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-800 text-sm">Conquiste Medalhas</h3>
              <p className="text-xs text-gray-600 mt-1">Desbloqueie todos os eventos</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Button
              onClick={() => navigate('/timelines')}
              size="lg"
              className="px-16 py-8 text-2xl font-black rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 bg-gradient-to-r from-green-400 to-green-600 text-white border-b-4 border-green-700 hover:border-green-800"
            >
              COMEÇAR
            </Button>
            <Button
              onClick={() => setShowHowItWorks(true)}
              size="lg"
              variant="outline"
              className="px-8 py-8 text-xl font-bold rounded-2xl shadow-lg bg-white hover:bg-gray-50 text-gray-700 border-4 border-white"
            >
              <Info className="w-6 h-6 mr-2" />
              Como Funciona
            </Button>
          </div>

          {/* Footer */}
          <div className="pt-8">
            <p className="text-sm text-white opacity-80 font-semibold">
              ✨ Para estudantes de 12-16 anos • Ensino Fundamental
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Modal */}
      <Dialog open={showHowItWorks} onOpenChange={setShowHowItWorks}>
        <DialogContent 
          className="max-w-2xl bg-white rounded-3xl border-4 border-green-500"
        >
          <DialogHeader>
            <DialogTitle className="text-3xl font-black text-gray-800 flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-yellow-500" />
              Como Funciona
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600 font-semibold">
              Sua jornada pela história do Brasil em 4 passos! 🚀
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex gap-4 bg-green-50 p-4 rounded-2xl border-2 border-green-200">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-2xl font-black text-white shadow-lg">
                1
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">🗺️ Navegue na Timeline</h3>
                <p className="text-gray-700">
                  Explore a linha do tempo e escolha um evento histórico para estudar
                </p>
              </div>
            </div>
            <div className="flex gap-4 bg-blue-50 p-4 rounded-2xl border-2 border-blue-200">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-2xl font-black text-white shadow-lg">
                2
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">🔍 Explore e Descubra</h3>
                <p className="text-gray-700">
                  Clique em elementos da cena interativa para aprender sobre o evento
                </p>
              </div>
            </div>
            <div className="flex gap-4 bg-orange-50 p-4 rounded-2xl border-2 border-orange-200">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-2xl font-black text-white shadow-lg">
                3
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">🎯 Responda Quizzes</h3>
                <p className="text-gray-700">
                  Teste seus conhecimentos com questões divertidas e interativas
                </p>
              </div>
            </div>
            <div className="flex gap-4 bg-purple-50 p-4 rounded-2xl border-2 border-purple-200">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-2xl font-black text-white shadow-lg">
                4
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">🏆 Conquiste e Avance</h3>
                <p className="text-gray-700">
                  Veja seu resultado e desbloqueie o próximo evento histórico
                </p>
              </div>
            </div>
          </div>
          <div className="text-center pt-4">
            <Button
              onClick={() => {
                setShowHowItWorks(false);
                navigate('/timelines');
              }}
              size="lg"
              className="px-12 py-6 text-xl font-black rounded-2xl bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg hover:shadow-xl transition-all"
            >
              Vamos Começar! 🎉
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
