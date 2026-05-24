Descrição das telas do sistema “Linha do Tempo do Brasil” para uso no Figma Make.

O sistema é composto por um fluxo principal que inicia na autenticação do usuário (login ou registro), seguido pela navegação na linha do tempo, acesso às unidades, visualização de conteúdo, realização de atividades e exibição de resultados. O layout geral segue um padrão com sidebar fixa à esquerda e conteúdo principal à direita.

Tela de Login

A tela de login deve possuir um layout centralizado com um card no meio da tela. No topo do card deve estar o nome ou logo do sistema. Abaixo, um título indicando “Entrar”.

Devem existir dois campos de entrada: um para email e outro para senha. Abaixo dos campos, um botão principal com o texto “Entrar”. Logo abaixo, um link com o texto “Não tem conta? Criar conta”, que redireciona para a tela de registro.

Os campos devem possuir validação visual, exibindo mensagens de erro em caso de dados inválidos ou campos vazios. O botão deve possuir estado de loading ao enviar os dados.

Tela de Registro

A tela de registro segue o mesmo padrão visual da tela de login, com um card centralizado.

Deve conter os seguintes campos: nome, email, senha e confirmação de senha. Abaixo dos campos, um botão principal com o texto “Criar conta”. Também deve haver um link com o texto “Já tenho conta” para retornar ao login.

Deve haver validação de campos obrigatórios, validação de email e verificação se as senhas coincidem.

Tela Principal (Linha do Tempo)

A tela principal é composta por duas áreas: uma sidebar fixa à esquerda e uma área de conteúdo principal à direita.

Na sidebar devem existir os seguintes elementos:

Nome do sistema no topo
Botão ou link “Linha do tempo” (selecionado por padrão)
Botão “Conquistas”
Botão “Avaliação”
Botão “Resultados”
Botão “Perfil”

Os itens da sidebar devem possuir estado ativo (destacado) e hover.

Na área principal, no topo direito deve haver um botão de configurações.

No centro da tela deve existir um componente de linha do tempo horizontal. Essa linha deve representar eventos históricos organizados cronologicamente. Cada evento deve ser representado por um ponto.

Os pontos da linha do tempo devem ter estados diferentes:

Não desbloqueado (cinza)
Disponível (destacado)
Concluído (cor diferente, por exemplo verde)

Ao clicar em um ponto, o usuário deve acessar a unidade correspondente.

Acima da linha do tempo pode haver um indicador do evento ou unidade selecionada (por exemplo: “Unidade 1”).

Tela de Unidade (Conteúdo)

Essa tela é acessada ao selecionar um evento da linha do tempo.

O layout mantém a sidebar à esquerda. A área principal deve ser dividida em duas partes.

Na lateral esquerda da área principal deve existir um painel com:

Nome da unidade (ex: “Unidade 1.1 – Chegada dos Portugueses (1500)”)
Um indicador de progresso vertical mostrando o avanço dentro da unidade
Um botão “Sair” para retornar à linha do tempo

Na área principal (direita) deve existir:

Título da seção (ex: “O que aconteceu?”)
Um bloco de texto com o conteúdo explicativo
Uma imagem ilustrativa relacionada ao conteúdo

A imagem pode futuramente ser interativa (com pontos clicáveis), mas inicialmente pode ser apenas informativa.

Abaixo do conteúdo deve existir um botão “Ir para atividades”, que só deve ser habilitado quando o usuário visualizar todo o conteúdo necessário.

Tela de Atividades

Essa tela segue a mesma estrutura da tela de conteúdo, mantendo a sidebar e o painel lateral da unidade.

Na área principal deve ser exibido:

Título (ex: “O que aconteceu? – Exercícios”)
Pergunta
Alternativas de resposta

No caso de verdadeiro ou falso:

Botão “Verdadeiro”
Botão “Falso”

Para múltipla escolha:

Lista de opções selecionáveis

Ao responder:

Feedback imediato pode ser exibido (correto/incorreto)
Após responder todas as questões, o sistema deve liberar o resultado

Tela de Resultado

Após finalizar as atividades, o usuário deve visualizar uma tela de resultado.

Essa tela deve apresentar:

Pontuação obtida
Quantidade de acertos e erros
Feedback geral (por exemplo: “Bom trabalho” ou “Você pode revisar o conteúdo”)

Deve haver um botão para retornar à linha do tempo.

A conclusão da unidade deve atualizar o estado do ponto correspondente na linha do tempo.

Tela de Perfil

A tela de perfil deve exibir informações do usuário, como nome e email. Pode conter também:

Progresso geral
Unidades concluídas
Opção de logout

Tela de Conquistas

Essa tela deve listar conquistas desbloqueadas pelo usuário, como:

Primeira unidade concluída
Sequência de acertos
Progresso na linha do tempo

Cada conquista pode ser exibida como um card com título, descrição e estado (bloqueada ou desbloqueada).

Tela de Resultados Gerais

Essa tela deve apresentar um histórico de desempenho do usuário, incluindo:

Unidades concluídas
Pontuação em cada atividade
Possivelmente gráficos simples de desempenho

Componentes reutilizáveis

Botão primário: usado para ações principais (entrar, avançar, responder)
Botão secundário: usado para ações menos prioritárias
Input de texto: com label e validação
Card: utilizado em login, registro e resultados
Item de sidebar: com estados ativo e hover
Ponto da linha do tempo: com estados (bloqueado, disponível, concluído)
Indicador de progresso: barra vertical ou horizontal
Card de questão: estrutura base para perguntas

Estados e comportamentos

Botões devem possuir estados: normal, hover, ativo, desabilitado
Inputs devem possuir estados: normal, foco, erro
Linha do tempo deve refletir progresso em tempo real
Atividades só devem ser liberadas após interação com o conteúdo
Usuário não pode acessar unidades bloqueadas

Sugestões de UX

Usar cores para indicar progresso (verde para concluído, cinza para bloqueado)
Manter consistência entre telas (mesma estrutura de sidebar)
Feedback imediato nas atividades melhora aprendizado
Evitar telas muito carregadas, manter foco no conteúdo
Indicar claramente onde o usuário está na jornada (breadcrumb ou título da unidade)

Essa estrutura já está pronta para ser transformada em design no Figma, mantendo consistência visual e facilitando a implementação no frontend.