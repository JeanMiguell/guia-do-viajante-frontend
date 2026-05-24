Crie um protótipo (wireframe + UI) para um sistema educacional web chamado **Linha do Tempo do Brasil** (Atlas Histórico Interativo). 
IMPORTANTE: não é um jogo educacional. É uma ferramenta de estudo gamificada (progressão, capítulos, atividades), com foco em aprendizagem de História do Brasil.

Objetivo:
O aluno navega por uma **linha do tempo reta** com marcos históricos. Ao tocar/clicar num marco, abre uma **capa do evento** (introdução). Ao clicar em “Estudar”, entra numa **cena interativa** (cenário ilustrado com elementos clicáveis) que apresenta o conteúdo de forma visual e curta. Depois o aluno vai para **atividades** (quiz múltipla escolha, verdadeiro/falso, ligação de colunas). Ao concluir, vê o **resultado** e volta para a timeline ou avança para o próximo evento.

Estilo Visual:
- Tema “história/atlas antigo” moderno: textura leve de papel/pergaminho, elementos em dourado/brass, ícones de bússola.
- Paleta: fundo claro (bege/papel), textos em marrom escuro ou azul marinho, botões principais em dourado/laranja suave.
- Tipografia: títulos serifados (clima histórico) e textos sans-serif (legibilidade).
- Interface responsiva: criar frames Desktop (1440px) e Mobile (390px) para as telas principais.
- Criar componentes reutilizáveis: Botão primário, Botão secundário, Card de evento, Card de conteúdo, Modal de objeto clicável, Cartão de questão, Barra de progresso, Navegação superior.

Telas obrigatórias (criar no mínimo 6 telas principais, com variações mobile):
---------------------------------------

FRAME 1 — HOME / BOAS-VINDAS
Nome do frame: “Home”
Layout:
- Topo com logo (ícone bússola) + título: “Linha do Tempo do Brasil”
- Subtítulo: “Explore eventos históricos em uma jornada visual. Estude com cenários interativos e atividades rápidas.”
- Botão principal: “Começar”
- Botão secundário: “Como funciona”
- Ilustração/hero: mapa do Brasil estilizado ao fundo.
- Rodapé com: “Versão protótipo • Ensino Fundamental (anos finais)”
Interações:
- Clique em “Começar” → vai para FRAME 2 (Timeline)
- Clique em “Como funciona” → abre um modal explicando o fluxo (Timeline → Estudar → Atividades → Resultado)

---------------------------------------

FRAME 2 — TIMELINE (LINHA DO TEMPO PRINCIPAL)
Nome do frame: “Timeline”
Layout:
- Header fixo: logo + “Linha do Tempo do Brasil” + ícone de perfil (placeholder) + ícone de acessibilidade.
- Área central com uma linha horizontal longa (tipo trilha), com pontos/bolas clicáveis.
- Pontos com status:
  - Desbloqueado: círculo preenchido com borda dourada + check se concluído
  - Atual: círculo destacado (glow)
  - Bloqueado: círculo cinza + cadeado
- Exibir pelo menos 8 marcos com labels:
  1500 “Chegada dos Portugueses”
  1534 “Capitanias Hereditárias”
  1600 “Economia Açucareira”
  1690 “Ciclo do Ouro”
  1808 “Chegada da Família Real”
  1822 “Independência”
  1888 “Abolição”
  1889 “Proclamação da República”
- Barra de progresso no topo da timeline: “Progresso geral: 2/8 concluídos (25%)”
- Painel lateral (desktop) ou bottom sheet (mobile) com:
  - “Evento selecionado”
  - mini descrição (1 frase)
  - botões: “Ver introdução” e “Continuar de onde parei”
Interações:
- Clicar em um ponto desbloqueado → abre FRAME 3 (Introdução do evento)
- Clicar em um ponto bloqueado → mostra tooltip “Complete o evento anterior para desbloquear.”

---------------------------------------

FRAME 3 — INTRODUÇÃO DO EVENTO (CAPA DO CAPÍTULO)
Nome do frame: “Introdução do Evento”
Criar exemplo para o evento: “1500 — Chegada dos Portugueses”
Layout:
- Header com botão voltar (← Timeline)
- Card grande com:
  - Título: “1500 — Chegada dos Portugueses”
  - Texto curto (2–3 linhas): 
    “Em 1500, expedições portuguesas chegaram ao território que hoje chamamos Brasil. Esse marco deu início ao processo de colonização e mudanças profundas nas populações originárias.”
  - Mini seção “O que você vai aprender” com bullets:
    • Quem participou do evento
    • Motivações da navegação portuguesa
    • Primeiras consequências do contato
- Ilustração de fundo: mar/oceano + navio + mapa antigo.
- Botão primário grande: “Estudar”
- Botão secundário: “Ver fontes/curiosidades”
Interações:
- “Estudar” → FRAME 4 (Cena interativa)
- “Ver fontes/curiosidades” → abre modal com 3 curiosidades curtas (placeholder)

---------------------------------------

FRAME 4 — CENA INTERATIVA (APRENDIZAGEM POR EXPLORAÇÃO)
Nome do frame: “Cena Interativa”
Contexto: “Chegada dos Portugueses”
Layout:
- Header com:
  - voltar (← Introdução)
  - título pequeno: “Exploração”
  - indicador de etapa: “Etapa 1/2: Explorar”
- Cenário ilustrado grande ocupando a maior parte da tela:
  - Elementos clicáveis com hotspots (ícones pequenos):
    1) Navio
    2) Mapa náutico
    3) Navegador/Capitão
    4) Praia/chegada
- Instrução: “Clique nos elementos para descobrir informações.”
- Quando clicar em um hotspot, abrir um **modal/card flutuante** com:
  - Título do item (ex: “Navio”)
  - Texto micro (1–2 frases)
  - Botão “Próximo”
- Abaixo (desktop) ou no rodapé (mobile) mostrar “Itens explorados: 0/4”.
- Quando o aluno explorar 4/4, mostrar um estado de conclusão:
  - mensagem: “Você explorou os principais elementos deste evento.”
  - Botão primário: “Ir para atividades”
Interações:
- clicar em hotspots → abre modal com conteúdo
- “Ir para atividades” → FRAME 5

---------------------------------------

FRAME 5 — ATIVIDADES (QUIZ + LIGAÇÃO)
Nome do frame: “Atividades”
Layout:
- Header com:
  - voltar (← Cena interativa)
  - título: “Atividades”
  - indicador: “Etapa 2/2: Praticar”
- Mostrar um bloco com 3 questões (paginadas ou em cards):
  Questão 1 (Múltipla escolha):
    Pergunta: “Qual era um dos principais objetivos das navegações portuguesas?”
    Opções:
      a) Fazer turismo
      b) Encontrar novas rotas comerciais
      c) Construir ferrovias
      d) Criar fábricas
  Questão 2 (Verdadeiro/Falso):
    “A chegada portuguesa ocorreu em 1500.” [Verdadeiro] [Falso]
  Questão 3 (Ligar colunas):
    Coluna A:
      “Pedro Álvares Cabral”
      “Mapa náutico”
      “Rotas comerciais”
    Coluna B:
      “Líder da expedição de 1500”
      “Ferramenta de navegação”
      “Motivação econômica”
    Interação de ligação: arrastar linhas ou selecionar pares.
- Botão primário: “Finalizar”
- Botão secundário: “Rever conteúdo” (volta para Cena Interativa)
Interações:
- “Finalizar” → FRAME 6 (Resultado)
- “Rever conteúdo” → FRAME 4

---------------------------------------

FRAME 6 — RESULTADO E PRÓXIMO PASSO
Nome do frame: “Resultado”
Layout:
- Card central com:
  - Título: “Evento concluído!”
  - Mensagem:
    “Você acertou 2 de 3 questões.”
  - Feedback:
    - Se errou algo, mostrar “Revise o item: Rotas comerciais”
  - Progresso:
    - “Progresso geral: 3/8 (37%)” (exemplo)
- Botões:
  - Primário: “Próximo evento”
  - Secundário: “Voltar para linha do tempo”
  - Link pequeno: “Refazer atividades”
Interações:
- “Próximo evento” → abre Introdução do próximo evento (ex: 1534 Capitanias)
- “Voltar para linha do tempo” → FRAME 2
- “Refazer atividades” → FRAME 5

---------------------------------------

Acessibilidade (incluir no protótipo):
- Botão/ícone no header para:
  - aumentar fonte (A+ / A-)
  - alto contraste
- Tooltips com texto curto e claro.

Entregáveis:
- Criar frames com nomes claros, e setas de navegação entre os frames.
- Criar versões mobile (390px) pelo menos para: Timeline, Introdução, Cena Interativa e Atividades.
- Garantir consistência visual e componentes reutilizáveis.