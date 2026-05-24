export interface Event {
  id: string;
  year: number;
  title: string;
  shortDescription: string;
  introduction: string;
  learningPoints: string[];
  curiosities: string[];
  locked: boolean;
  completed: boolean;
  characterImage?: string;
  color: string;
  icon: string;
}

export const events: Event[] = [
  {
    id: '1500-chegada',
    year: 1500,
    title: 'Chegada dos Portugueses',
    shortDescription: 'Descobrimento do Brasil',
    introduction: 'Em 1500, expedições portuguesas chegaram ao território que hoje chamamos Brasil. Esse marco deu início ao processo de colonização e mudanças profundas nas populações originárias.',
    learningPoints: [
      'Quem participou do evento',
      'Motivações da navegação portuguesa',
      'Primeiras consequências do contato',
    ],
    curiosities: [
      'Pedro Álvares Cabral comandava uma frota de 13 navios',
      'A primeira carta sobre o Brasil foi escrita por Pero Vaz de Caminha',
      'O pau-brasil foi o primeiro produto explorado pelos portugueses',
    ],
    locked: false,
    completed: false,
    characterImage: 'https://images.unsplash.com/photo-1714427833852-63191eb45caa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0b29uJTIwcG9ydHVndWVzZSUyMHNhaWxvciUyMHNoaXB8ZW58MXx8fHwxNzcyOTA5ODk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#6366f1',
  },
  {
    id: '1534-capitanias',
    year: 1534,
    title: 'Capitanias Hereditárias',
    shortDescription: 'Sistema administrativo colonial',
    introduction: 'Para organizar a colonização, Portugal dividiu o Brasil em faixas de terra chamadas capitanias hereditárias, entregues a nobres portugueses.',
    learningPoints: [
      'O que eram as capitanias',
      'Como funcionava o sistema',
      'Resultados do modelo',
    ],
    curiosities: [
      'Foram criadas 15 capitanias hereditárias',
      'Poucas capitanias prosperaram economicamente',
      'Algumas capitanias viraram estados brasileiros',
    ],
    locked: true,
    completed: false,
    characterImage: 'https://images.unsplash.com/photo-1763478077525-153b1edec934?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0b29uJTIwY29sb25pYWwlMjBicmF6aWwlMjBpbGx1c3RyYXRpb258ZW58MXx8fHwxNzcyOTA5OTAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#8b5cf6',
  },
  {
    id: '1808-familia-real',
    year: 1808,
    title: 'Chegada da Família Real',
    shortDescription: 'Corte portuguesa no Brasil',
    introduction: 'Fugindo de Napoleão Bonaparte, a família real portuguesa transferiu-se para o Brasil, transformando o Rio de Janeiro na capital do império português.',
    learningPoints: [
      'Motivos da vinda da família real',
      'Transformações no Brasil',
      'Abertura dos portos',
    ],
    curiosities: [
      'Foram cerca de 15 mil pessoas na comitiva real',
      'O Rio de Janeiro tornou-se a única capital europeia fora da Europa',
      'Dom João VI criou bibliotecas, teatros e instituições',
    ],
    locked: true,
    completed: false,
    characterImage: 'https://images.unsplash.com/photo-1742189415527-9149c0c546c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0b29uJTIwZW1wZXJvciUyMHJveWFsJTIwY3Jvd258ZW58MXx8fHwxNzcyOTA5OTAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#06b6d4',
  },
  {
    id: '1822-independencia',
    year: 1822,
    title: 'Independência',
    shortDescription: 'Independência do Brasil',
    introduction: 'Em 7 de setembro de 1822, Dom Pedro I proclamou a independência do Brasil às margens do rio Ipiranga, separando o Brasil de Portugal.',
    learningPoints: [
      'Contexto da independência',
      'Papel de Dom Pedro I',
      'Consequências políticas',
    ],
    curiosities: [
      'O grito "Independência ou Morte" tornou-se símbolo nacional',
      'José Bonifácio foi o "Patriarca da Independência"',
      'O Brasil foi o único país americano a tornar-se um império',
    ],
    locked: true,
    completed: false,
    characterImage: 'https://images.unsplash.com/photo-1742189415527-9149c0c546c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0b29uJTIwZW1wZXJvciUyMHJveWFsJTIwY3Jvd258ZW58MXx8fHwxNzcyOTA5OTAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#10b981',
  },
  {
    id: '1888-abolicao',
    year: 1888,
    title: 'Abolição',
    shortDescription: 'Fim da escravidão',
    introduction: 'A Lei Áurea, assinada pela Princesa Isabel em 13 de maio de 1888, aboliu definitivamente a escravidão no Brasil.',
    learningPoints: [
      'Movimento abolicionista',
      'Lei Áurea',
      'Impactos sociais',
    ],
    curiosities: [
      'O Brasil foi o último país das Américas a abolir a escravidão',
      'Mais de 700 mil pessoas foram libertadas',
      'A lei tinha apenas dois artigos',
    ],
    locked: true,
    completed: false,
    characterImage: 'https://images.unsplash.com/photo-1734092916497-2105a961a00a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0b29uJTIwcHJpbmNlc3MlMjBpbGx1c3RyYXRpb24lMjBjaGFyYWN0ZXJ8ZW58MXx8fHwxNzcyOTA5OTAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#f59e0b',
  },
  {
    id: '1889-republica',
    year: 1889,
    title: 'Proclamação da República',
    shortDescription: 'Fim do Império',
    introduction: 'Em 15 de novembro de 1889, o Marechal Deodoro da Fonseca proclamou a República, encerrando o período imperial brasileiro.',
    learningPoints: [
      'Crise do Império',
      'Papel dos militares',
      'Início da República',
    ],
    curiosities: [
      'Dom Pedro II estava doente no dia da proclamação',
      'A família imperial foi exilada para a Europa',
      'O golpe foi praticamente sem derramamento de sangue',
    ],
    locked: true,
    completed: false,
    characterImage: 'https://images.unsplash.com/photo-1731363106135-83fb05b5accb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0b29uJTIwbWlsaXRhcnklMjBnZW5lcmFsJTIwdW5pZm9ybXxlbnwxfHx8fDE3NzI5MDk5MDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#ec4899',
  },
];