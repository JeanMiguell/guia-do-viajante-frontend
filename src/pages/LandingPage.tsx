import { useNavigate } from "react-router-dom";
import { Button } from "../app/components/button";

import MascoteImage from "../assets/mascot.png";
import LinhaTempo from "../assets/linha-do-tempo.png";
import Sequencia from "../assets/sequencia.png";
import Progresso from "../assets/progresso.png";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f6f3eb] text-gray-800">

      {/* HEADER */}
      <header className="fixed top-0 w-full bg-[#f6f3eb]/80 backdrop-blur border-b border-[#e5e0d6] z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">

          <h1
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-black text-[#a67c2e] text-lg cursor-pointer"
          >
            Guia do Viajante do Tempo
          </h1>

          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/login")}
              className="bg-white border border-[#e5e0d6] text-gray-700 hover:bg-gray-100 transition-all hover:scale-105"
            >
              Entrar
            </Button>

            <Button
              onClick={() => navigate("/register")}
              className="bg-[#d6a84f] text-black font-bold hover:bg-[#c99b3f] transition-all hover:scale-105 shadow-sm hover:shadow-md"
            >
              Começar
            </Button>
          </div>

        </div>
      </header>

      {/* HERO */}
      <section className="flex items-center pt-28 pb-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 px-6 items-center">

          {/* MASCOTE */}
          <div className="flex justify-center">
            <div className="bg-transparent p-6">
              <img
                src={MascoteImage}
                alt="Mascote viajante do tempo"
                className="w-[300px] lg:w-[400px]"
              />
            </div>
          </div>

          {/* TEXTO */}
          <div className="flex flex-col gap-6 text-center lg:text-left">

            <h1 className="text-4xl lg:text-5xl font-black leading-tight">
              Aprenda{" "}
              <span className="text-[#a67c2e]">
                história do Brasil
              </span>{" "}
              de forma divertida
            </h1>

            <p className="text-gray-600 text-lg">
              Explore eventos históricos, desbloqueie conteúdos e acompanhe sua evolução em uma jornada interativa.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

              <Button
                onClick={() => navigate("/register")}
                className="
                  bg-[#d6a84f] text-black font-bold px-8 py-4
                  hover:bg-[#c99b3f]
                  transition-all duration-200
                  hover:scale-105 active:scale-95
                  shadow-md hover:shadow-lg
                "
              >
                Começar Jornada
              </Button>

              <Button
                onClick={() => navigate("/login")}
                className="
                  bg-white border border-[#e5e0d6] text-gray-700 px-8 py-4
                  hover:bg-gray-100
                  transition-all duration-200
                  hover:scale-105 active:scale-95
                "
              >
                Já tenho uma conta
              </Button>

            </div>

          </div>

        </div>
      </section>

      {/* SEÇÃO 1 */}
      <section className="py-20 bg-[#efe9dc]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 px-6 items-center">

          <div>
            <h2 className="text-3xl lg:text-4xl font-black text-[#a67c2e] mb-4">
              Explore a linha do tempo
            </h2>

            <p className="text-gray-600 text-lg">
              Viaje pelos principais acontecimentos da história do Brasil de forma visual e interativa.
            </p>
          </div>

          <div className="flex justify-center">
            <img
              src={LinhaTempo}
              className="w-full max-w-[500px] drop-shadow-md"
            />
          </div>

        </div>
      </section>

      {/* SEÇÃO 2 */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 px-6 items-center">

          <div className="flex justify-center lg:order-1 order-2">
            <img
              src={Sequencia}
              className="w-full max-w-[500px] drop-shadow-md"
            />
          </div>

          <div className="lg:order-2 order-1">
            <h2 className="text-3xl lg:text-4xl font-black text-[#a67c2e] mb-4">
              Aprenda no seu ritmo
            </h2>

            <p className="text-gray-600 text-lg">
              Cada evento possui unidades com conteúdos explicativos e atividades interativas.
            </p>
          </div>

        </div>
      </section>

      {/* SEÇÃO 3 */}
      <section className="py-20 bg-[#efe9dc]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 px-6 items-center">

          <div>
            <h2 className="text-3xl lg:text-4xl font-black text-[#a67c2e] mb-4">
              Acompanhe seu progresso
            </h2>

            <p className="text-gray-600 text-lg">
              Veja o quanto você já avançou e desbloqueie novos conteúdos conforme evolui.
            </p>
          </div>

          <div className="flex justify-center">
            <img
              src={Progresso}
              className="w-full max-w-[600px] drop-shadow-md"
            />
          </div>

        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 text-center bg-[#a67c2e] text-white">

        <h2 className="text-4xl font-black mb-6">
          Pronto para começar sua jornada?
        </h2>

        <Button
          onClick={() => navigate("/register")}
          className="
            bg-[#d6a84f] text-black font-bold px-10 py-5
            hover:bg-[#c99b3f]
            transition-all duration-200
            hover:scale-105 active:scale-95
            shadow-md hover:shadow-xl
          "
        >
          Criar Conta
        </Button>

      </section>

    </div>
  );
}