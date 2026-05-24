import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChevronLeft, X, Sparkles, Eye } from 'lucide-react';
import { Progress } from './ui/progress';
import { events } from '../data/events';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SceneElement {
  id: string;
  title: string;
  description: string;
  position: { top: string; left: string };
}

const sceneElements: Record<string, SceneElement[]> = {
  '1500-chegada': [
    {
      id: 'navio',
      title: 'A Caravela Portuguesa',
      description: 'As caravelas portuguesas eram navios projetados para longas viagens oceânicas, equipados com velas triangulares que permitiam navegar contra o vento. A frota de Cabral tinha 13 navios.',
      position: { top: '40%', left: '30%' },
    },
    {
      id: 'cabral',
      title: 'Pedro Álvares Cabral',
      description: 'Pedro Álvares Cabral comandou a expedição de 1500. Era um nobre português escolhido pelo rei Dom Manuel I para liderar a frota que chegaria ao Brasil.',
      position: { top: '25%', left: '60%' },
    },
    {
      id: 'indigena',
      title: 'Povos Indígenas',
      description: 'Os povos indígenas já habitavam o Brasil há milhares de anos antes da chegada dos portugueses. Eram os verdadeiros habitantes originais destas terras.',
      position: { top: '55%', left: '50%' },
    },
    {
      id: 'encontro',
      title: 'O Encontro Histórico',
      description: 'Em 22 de abril de 1500, a expedição portuguesa avistou terra, desembarcando na região que hoje chamamos de Porto Seguro, na Bahia. Foi o primeiro contato entre europeus e os povos nativos desta terra.',
      position: { top: '70%', left: '70%' },
    },
  ],
};

export function InteractiveScene() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [exploredElements, setExploredElements] = useState<Set<string>>(new Set());
  const [selectedElement, setSelectedElement] = useState<SceneElement | null>(null);

  const event = events.find(e => e.id === eventId);
  const elements = sceneElements[eventId || ''] || [];
  const totalElements = elements.length;
  const exploredCount = exploredElements.size;
  const progress = (exploredCount / totalElements) * 100;
  const allExplored = exploredCount === totalElements;

  const handleElementClick = (element: SceneElement) => {
    setSelectedElement(element);
    setExploredElements(prev => new Set([...prev, element.id]));
  };

  if (!event) {
    return <div>Evento não encontrado</div>;
  }

  // Special layout for 1500 event with visible characters
  const is1500Event = eventId === '1500-chegada';

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b-4 shadow-md" style={{ borderColor: event.color }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="rounded-full hover:bg-gray-100 font-bold"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-2">
                <Eye className="w-6 h-6" style={{ color: event.color }} />
                <h2 className="text-xl font-black text-gray-800">
                  Exploração 🔍
                </h2>
              </div>
              <p className="text-sm text-gray-600 font-semibold">
                Descubra os segredos da história!
              </p>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Instructions */}
          <Card 
            className="mb-6 border-4 bg-white shadow-lg"
            style={{ 
              borderColor: event.color,
            }}
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="w-6 h-6" style={{ color: event.color }} />
                <p className="text-center font-bold text-gray-800">
                  Clique nos pontos brilhantes para descobrir informações!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-gray-700">
                Itens explorados
              </span>
              <span className="text-lg font-black" style={{ color: event.color }}>
                {exploredCount}/{totalElements}
              </span>
            </div>
            <Progress 
              value={progress} 
              className="h-4 bg-gray-200"
            />
          </div>

          {/* Interactive Scene */}
          <Card 
            className="border-4 shadow-2xl overflow-hidden bg-white"
            style={{ 
              borderColor: event.color,
            }}
          >
            {is1500Event ? (
              /* Special 1500 Scene with Illustrated Characters */
              <div 
                className="relative h-[500px] md:h-[700px] bg-gradient-to-b from-sky-300 via-blue-200 to-amber-100"
              >
                {/* Ocean Waves decoration */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-400 to-transparent opacity-40"></div>
                
                {/* Beach/Sand */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-amber-200 to-transparent"></div>

                {/* Character: The Ship (Caravela) */}
                <button
                  onClick={() => handleElementClick(elements[0])}
                  className="absolute transform transition-all hover:scale-105 group"
                  style={{ top: '15%', left: '15%' }}
                >
                  <div className="relative">
                    {!exploredElements.has('navio') && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
                    )}
                    <div className="bg-white rounded-3xl p-4 shadow-2xl border-4 border-blue-500 w-48">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1670283401314-d75e418ce688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0b29uJTIwc2FpbGluZyUyMHNoaXAlMjBjYXJhdmVsJTIwYm9hdCUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NzM2MzAxODF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Caravela"
                        className="w-full h-32 object-cover rounded-2xl"
                      />
                      <div className="mt-2 text-center">
                        <p className="font-black text-blue-700 text-sm">⛵ A Caravela</p>
                        {exploredElements.has('navio') && (
                          <span className="text-2xl">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Character: Pedro Álvares Cabral */}
                <button
                  onClick={() => handleElementClick(elements[1])}
                  className="absolute transform transition-all hover:scale-105 group"
                  style={{ top: '35%', right: '15%' }}
                >
                  <div className="relative">
                    {!exploredElements.has('cabral') && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
                    )}
                    <div className="bg-white rounded-3xl p-4 shadow-2xl border-4 border-amber-500 w-48">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1610794764253-c1e445fba255?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0b29uJTIwcG9ydHVndWVzZSUyMGV4cGxvcmVyJTIwc2FpbG9yJTIwY2hhcmFjdGVyJTIwaWxsdXN0cmF0aW9ufGVufDF8fHx8MTc3MzYzMDE4MXww&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Pedro Álvares Cabral"
                        className="w-full h-32 object-cover rounded-2xl"
                      />
                      <div className="mt-2 text-center">
                        <p className="font-black text-amber-700 text-sm">⚓ Pedro Álvares Cabral</p>
                        {exploredElements.has('cabral') && (
                          <span className="text-2xl">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Character: Indigenous Brazilian */}
                <button
                  onClick={() => handleElementClick(elements[2])}
                  className="absolute transform transition-all hover:scale-105 group"
                  style={{ top: '60%', left: '25%' }}
                >
                  <div className="relative">
                    {!exploredElements.has('indigena') && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
                    )}
                    <div className="bg-white rounded-3xl p-4 shadow-2xl border-4 border-green-500 w-48">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1739997698960-60b2a5c243ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0b29uJTIwbmF0aXZlJTIwdHJpYmFsJTIwcGVyc29uJTIwY29sb3JmdWwlMjBpbGx1c3RyYXRpb258ZW58MXx8fHwxNzczNjMwMTg0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Povos Indígenas"
                        className="w-full h-32 object-cover rounded-2xl"
                      />
                      <div className="mt-2 text-center">
                        <p className="font-black text-green-700 text-sm">🌿 Povos Indígenas</p>
                        {exploredElements.has('indigena') && (
                          <span className="text-2xl">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Fourth Element: Historical Meeting Point */}
                <button
                  onClick={() => handleElementClick(elements[3])}
                  className="absolute transform transition-all hover:scale-105 group"
                  style={{ bottom: '15%', right: '25%' }}
                >
                  <div className="relative">
                    {!exploredElements.has('encontro') && (
                      <div className="absolute inset-0 rounded-full animate-ping bg-yellow-400 opacity-60"></div>
                    )}
                    <div
                      className="relative w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-2xl bg-gradient-to-br from-yellow-300 to-orange-400"
                      style={{ borderColor: 'white' }}
                    >
                      {exploredElements.has('encontro') ? (
                        <span className="text-3xl">✓</span>
                      ) : (
                        <Sparkles className="w-10 h-10 text-white animate-pulse" />
                      )}
                    </div>
                    <p className="text-center mt-2 font-black text-orange-700 text-xs bg-white px-3 py-1 rounded-full shadow-lg">
                      📍 Encontro
                    </p>
                  </div>
                </button>

                {/* Decorative Elements */}
                <div className="absolute top-10 left-1/2 text-6xl opacity-20">☁️</div>
                <div className="absolute top-20 right-1/4 text-5xl opacity-20">☁️</div>
                <div className="absolute bottom-32 left-1/3 text-4xl opacity-30">🌊</div>
              </div>
            ) : (
              /* Original Scene for other events */
              <div 
                className="relative h-[500px] md:h-[600px] bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1705807969047-958323840d58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBzYWlsaW5nJTIwc2hpcCUyMG9jZWFufGVufDF8fHx8MTc3Mjc0NzU0OHww&ixlib=rb-4.1.0&q=80&w=1080')`,
                }}
              >
                {/* Hotspots */}
                {elements.map((element) => {
                  const isExplored = exploredElements.has(element.id);
                  return (
                    <button
                      key={element.id}
                      onClick={() => handleElementClick(element)}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                      style={{
                        top: element.position.top,
                        left: element.position.left,
                      }}
                    >
                      <div className="relative">
                        {/* Pulse animation for unexplored items */}
                        {!isExplored && (
                          <div 
                            className="absolute inset-0 rounded-full animate-ping"
                            style={{ backgroundColor: event.color, opacity: 0.6 }}
                          />
                        )}
                        <div
                          className="relative w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all group-hover:scale-125 shadow-2xl"
                          style={{
                            backgroundColor: isExplored ? '#22c55e' : event.color,
                            borderColor: 'white',
                          }}
                        >
                          {isExplored ? (
                            <span className="text-2xl">✓</span>
                          ) : (
                            <Sparkles className="w-8 h-8 text-white animate-pulse" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Completion Message */}
          {allExplored && (
            <Card 
              className="mt-8 border-4 shadow-2xl overflow-hidden"
              style={{ 
                borderColor: '#22c55e',
              }}
            >
              <div 
                className="p-8 text-center bg-gradient-to-r from-green-400 to-green-500"
              >
                <div className="text-6xl mb-4 animate-bounce" style={{ animationDuration: '2s' }}>🎉</div>
                <p className="text-2xl font-black text-white mb-6">
                  Parabéns! Você explorou tudo! 
                </p>
                <Button
                  onClick={() => navigate(`/activities/${eventId}`)}
                  size="lg"
                  className="px-16 py-8 text-2xl font-black rounded-2xl shadow-lg hover:shadow-xl transition-all bg-white"
                  style={{
                    color: event.color,
                  }}
                >
                  Fazer Quiz Agora! 🎯
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Element Details Modal */}
      {selectedElement && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          onClick={() => setSelectedElement(null)}
        >
          <Card 
            className="max-w-lg w-full border-4 shadow-2xl bg-white animate-in fade-in zoom-in duration-200"
            style={{ 
              borderColor: event.color,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader 
              className="text-white rounded-t-lg flex flex-row items-center justify-between"
              style={{ 
                background: `linear-gradient(135deg, ${event.color} 0%, ${event.color}dd 100%)`,
              }}
            >
              <CardTitle className="text-2xl font-black">
                {selectedElement.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedElement(null)}
                className="text-white hover:bg-white/20 rounded-full"
              >
                <X className="w-6 h-6" />
              </Button>
            </CardHeader>
            <CardContent className="p-8">
              <div 
                className="p-4 rounded-2xl mb-6 border-4"
                style={{ 
                  backgroundColor: `${event.color}10`,
                  borderColor: `${event.color}40`,
                }}
              >
                <p className="text-lg leading-relaxed text-gray-700 font-semibold">
                  {selectedElement.description}
                </p>
              </div>
              <Button
                onClick={() => setSelectedElement(null)}
                className="w-full py-6 text-xl font-black rounded-2xl shadow-lg text-white"
                style={{
                  backgroundColor: event.color,
                }}
              >
                Entendi! 👍
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}