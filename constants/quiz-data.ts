export type DifficultyLevel = 'Iniciante' | 'Intermediário' | 'Avançado';

export interface QuizOption {
  id: string;
  label: string;
}

export interface QuizItemDefinition {
  id: string;
  title: string;
  prompt: string;
  code?: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface QuizUnitDefinition {
  id: string;
  title: string;
  description: string;
  ability: string;
  difficulty: DifficultyLevel;
  introContent: string[];
  items: QuizItemDefinition[];
}

export const quizUnits: QuizUnitDefinition[] = [
  {
    id: 'unit-variables',
    title: 'Variáveis na prática',
    description: 'Entenda como declarar, inicializar e atualizar valores simples em C++.',
    ability: 'Manipulação de variáveis',
    difficulty: 'Iniciante',
    introContent: [
      'Variáveis guardam valores que podem mudar durante a execução do programa.',
      'Você precisa escolher um tipo adequado (int, float, string) e inicializar antes de usar.',
      'Atualizar uma variável significa sobrescrever seu valor com base em uma nova expressão.',
    ],
    items: [
      {
        id: 'vars-inicializacao',
        title: 'Definindo um valor inicial',
        prompt: 'O que o código a seguir imprime?',
        code: `int vidas;
vidas = 3;

cout << vidas << endl;`,
        options: [
          { id: 'a', label: 'Nada, porque vidas não foi inicializada' },
          { id: 'b', label: '3' },
          { id: 'c', label: 'Erro de compilação por falta de return' },
          { id: 'd', label: 'Um valor aleatório' },
        ],
        correctOptionId: 'b',
        explanation: 'vidas recebe 3 antes do cout, então o valor impresso é 3.',
      },
      {
        id: 'vars-soma',
        title: 'Sobrescrevendo o valor',
        prompt: 'Qual será a saída após atualizar a variável pontos?',
        code: `int pontos = 5;
pontos = pontos + 2;

cout << pontos << endl;`,
        options: [
          { id: 'a', label: '2' },
          { id: 'b', label: '5' },
          { id: 'c', label: '7' },
          { id: 'd', label: 'Erro porque pontos é constante' },
        ],
        correctOptionId: 'c',
        explanation: 'pontos começa em 5, soma 2 e passa a valer 7 ao ser impresso.',
      },
      {
        id: 'vars-tipo-escolha',
        title: 'Escolhendo o tipo correto',
        prompt: 'Qual tipo você usaria para guardar um número com casas decimais?',
        options: [
          { id: 'a', label: 'int' },
          { id: 'b', label: 'float' },
          { id: 'c', label: 'bool' },
          { id: 'd', label: 'char' },
        ],
        correctOptionId: 'b',
        explanation: 'Valores fracionados precisam de tipos de ponto flutuante como float ou double.',
      },
      {
        id: 'vars-texto',
        title: 'Armazenando texto',
        prompt: 'O que acontece ao executar o código a seguir?',
        code: `string nome = "Ana";

cout << nome << endl;`,
        options: [
          { id: 'a', label: 'Imprime Ana na tela' },
          { id: 'b', label: 'Erro porque string não é permitido' },
          { id: 'c', label: 'Imprime um número aleatório' },
          { id: 'd', label: 'Entra em loop infinito' },
        ],
        correctOptionId: 'a',
        explanation: 'string é um tipo válido em C++ (com <string> incluído) e imprime o texto armazenado.',
      },
    ],
  },
  {
    id: 'unit-scope',
    title: 'Entendendo escopo',
    description: 'Veja como variáveis vivem dentro de funções e blocos.',
    ability: 'Escopo de variáveis',
    difficulty: 'Iniciante',
    introContent: [
      'Escopo define onde uma variável pode ser usada sem erro.',
      'Variáveis declaradas dentro de um bloco (entre chaves) só existem ali dentro.',
      'Evite depender de valores fora do escopo para não causar erros de compilação.',
    ],
    items: [
      {
        id: 'scope-if',
        title: 'Variável de bloco',
        prompt: 'O que acontece ao tentar compilar este código?',
        code: `if (true) {
  int nota = 10;
}

cout << nota << endl;`,
        options: [
          { id: 'a', label: 'Imprime 10 normalmente' },
          { id: 'b', label: 'Erro porque nota não existe fora do if' },
          { id: 'c', label: 'Imprime 0 por padrão' },
          { id: 'd', label: 'Repete 10 infinitamente' },
        ],
        correctOptionId: 'b',
        explanation: 'nota foi criada dentro do if e não está disponível após o bloco, gerando erro.',
      },
      {
        id: 'scope-func',
        title: 'Variável local em função',
        prompt: 'Qual é a saída do programa?',
        code: `int resultado() {
  int valor = 4;
  return valor * 2;
}

int main() {
  cout << resultado() << endl;
  cout << valor << endl;
}`,
        options: [
          { id: 'a', label: '8 e depois 4' },
          { id: 'b', label: '8 e depois erro de compilação' },
          { id: 'c', label: 'Erro antes de imprimir qualquer coisa' },
          { id: 'd', label: 'Nenhuma linha é executada' },
        ],
        correctOptionId: 'b',
        explanation:
          'resultado retorna 8, mas valor é local da função e não pode ser usado fora dela, causando erro.',
      },
      {
        id: 'scope-shadow',
        title: 'Sombreamento de variáveis',
        prompt: 'O que será impresso?',
        code: `int pontos = 3;

void somar() {
  int pontos = 1;
  cout << pontos << endl;
}

int main() {
  somar();
  cout << pontos << endl;
}`,
        options: [
          { id: 'a', label: '1 e depois 3' },
          { id: 'b', label: '3 e depois 3' },
          { id: 'c', label: '3 e depois 1' },
          { id: 'd', label: 'Apenas 1 é impresso' },
        ],
        correctOptionId: 'a',
        explanation:
          'A variável pontos dentro de somar esconde a global apenas dentro da função. Fora dela, o valor global (3) é usado.',
      },
    ],
  },
  {
    id: 'unit-functions',
    title: 'Chamadas de funções',
    description: 'Aprenda a declarar funções simples, passar argumentos e usar retornos.',
    ability: 'Funções básicas',
    difficulty: 'Iniciante',
    introContent: [
      'Funções agrupam passos que podem ser reutilizados pelo código.',
      'Parâmetros permitem receber valores externos, enquanto o return devolve um resultado.',
      'Use funções para quebrar problemas em partes menores e mais claras.',
    ],
    items: [
      {
        id: 'func-retorno',
        title: 'Usando return',
        prompt: 'Qual saída o programa gera?',
        code: `int somar(int a, int b) {
  return a + b;
}

int main() {
  cout << somar(2, 3) << endl;
}`,
        options: [
          { id: 'a', label: '2' },
          { id: 'b', label: '3' },
          { id: 'c', label: '5' },
          { id: 'd', label: 'Erro porque falta cout' },
        ],
        correctOptionId: 'c',
        explanation: 'somar devolve 5, e o cout imprime esse valor.',
      },
      {
        id: 'func-parametro',
        title: 'Alterando argumentos',
        prompt: 'O que o código imprime?',
        code: `void dobrar(int numero) {
  cout << numero * 2 << endl;
}

int main() {
  int valor = 6;
  dobrar(valor);
  cout << valor << endl;
}`,
        options: [
          { id: 'a', label: '12 e depois 12' },
          { id: 'b', label: '12 e depois 6' },
          { id: 'c', label: '6 e depois 6' },
          { id: 'd', label: 'Erro porque void não pode usar cout' },
        ],
        correctOptionId: 'b',
        explanation:
          'A função imprime 12, mas o valor original continua 6 porque o parâmetro é passado por cópia.',
      },
      {
        id: 'func-sem-retorno',
        title: 'Função sem retorno',
        prompt: 'Quando usar uma função void como esta?',
        code: `void avisar() {
  cout << "Pronto!" << endl;
}`,
        options: [
          { id: 'a', label: 'Quando preciso devolver um número' },
          { id: 'b', label: 'Quando só quero executar uma ação sem devolver valor' },
          { id: 'c', label: 'Nunca é permitido usar void' },
          { id: 'd', label: 'Apenas se o programa tiver menos de 10 linhas' },
        ],
        correctOptionId: 'b',
        explanation: 'Funções void servem para executar efeitos (imprimir, salvar, etc.) sem retorno.',
      },
    ],
  },
  {
    id: 'unit-intro',
    title: 'Fundamentos do Console',
    description:
      'Introdução aos tipos numéricos básicos, declarações simples e à função cout para imprimir valores.',
    ability: 'Sintaxe básica e I/O',
    difficulty: 'Iniciante',
    introContent: [
      'Vamos começar entendendo como o console mostra informações e como declarar valores simples.',
      'Observe como int e float são usados para guardar números e como cout imprime textos e resultados.',
      'Essas bases são essenciais para interpretar as próximas unidades.',
    ],
    items: [
      {
        id: 'intro-hello',
        title: 'Primeiro programa',
        prompt: 'O que o programa abaixo imprime no console?',
        code: `#include <iostream>
using namespace std;

int main() {
  cout << "Hello world" << endl;
  return 0;
}`,
        options: [
          { id: 'a', label: 'Hello world' },
          { id: 'b', label: 'hello world' },
          { id: 'c', label: 'Hello worldHello world' },
          { id: 'd', label: 'Nada, pois falta um return 0;' },
        ],
        correctOptionId: 'a',
        explanation: 'cout envia exatamente o texto entre aspas seguido de uma quebra de linha.',
      },
      {
        id: 'intro-sum-int',
        title: 'Somando inteiros',
        prompt: 'Qual será a saída do programa a seguir?',
        code: `int a = 10;
int b;
b = 15;

int c = a + b;

cout << c << endl;
cout << a + b << endl;`,
        options: [
          { id: 'a', label: '25' },
          { id: 'b', label: '25 e em seguida 25 novamente, cada um em sua linha' },
          { id: 'c', label: '0 e em seguida 25' },
          { id: 'd', label: 'Erro de compilação porque b não foi inicializada' },
        ],
        correctOptionId: 'b',
        explanation:
          'A variável c recebe 25 e o segundo cout repete o mesmo cálculo, imprimindo 25 nas duas linhas.',
      },
      {
        id: 'intro-sum-float',
        title: 'Precisão de ponto flutuante',
        prompt: 'Considerando o uso de float, quais valores serão impressos?',
        code: `float a = 10.7;
float b;
b = 15.3;

float c = a + b;

cout << c << endl;
cout << a + b << endl;`,
        options: [
          { id: 'a', label: '26.0 e 26.0 (uma vez em cada linha)' },
          { id: 'b', label: '26.0 na primeira linha e 25.0 na segunda' },
          { id: 'c', label: 'Uma repetição infinita de 26.0' },
          { id: 'd', label: 'Nenhum valor porque floats não podem ser somados' },
        ],
        correctOptionId: 'a',
        explanation:
          'A soma 10.7 + 15.3 resulta em 26.0 e é repetida na segunda linha, já que a expressão é recalculada.',
      },
      {
        id: 'intro-type-choice',
        title: 'Escolha do tipo',
        prompt:
          'Para armazenar o resultado de 10.7 + 15.3 sem perder a parte decimal, qual tipo é mais adequado?',
        options: [
          { id: 'a', label: 'int' },
          { id: 'b', label: 'float' },
          { id: 'c', label: 'char' },
          { id: 'd', label: 'bool' },
        ],
        correctOptionId: 'b',
        explanation:
          'Valores com casas decimais devem ser armazenados em tipos de ponto flutuante como float ou double.',
      },
    ],
  },
  {
    id: 'unit-conditionals',
    title: 'Decisões com if/else',
    description:
      'Trabalha o raciocínio condicional com ramificações simples e compostas usando operadores relacionais.',
    ability: 'Condicionais',
    difficulty: 'Intermediário',
    introContent: [
      'Condicionais permitem escolher caminhos diferentes no código conforme regras.',
      'No if/else, apenas o bloco com condição verdadeira é executado.',
      'Leia com atenção as comparações para prever qual bloco será acionado.',
    ],
    items: [
      {
        id: 'cond-first-check',
        title: 'Comparação incorreta',
        prompt: 'Dado key = 10, qual mensagem será exibida no primeiro bloco if/else abaixo?',
        code: `int key = 10;

cout << "If/Else 1:" << endl;
if (key == 9) {
  cout << "Key is 9" << endl;
} else {
  cout << "Key isn't 9" << endl;
}`,
        options: [
          { id: 'a', label: 'Key is 9' },
          { id: 'b', label: "Key isn't 9" },
          { id: 'c', label: 'Key is 10' },
          { id: 'd', label: 'Nenhuma, pois o programa trava' },
        ],
        correctOptionId: 'b',
        explanation: 'A condição é falsa, então o else é executado e imprime "Key isn\'t 9".',
      },
      {
        id: 'cond-second-check',
        title: 'Comparação verdadeira',
        prompt: 'No segundo bloco, ainda com key = 10, qual saída é gerada?',
        code: `int key = 10;

cout << "If/Else 2:" << endl;
if (key == 10) {
  cout << "Key is 10" << endl;
} else {
  cout << "Key isn't 10" << endl;
}`,
        options: [
          { id: 'a', label: 'Key is 10' },
          { id: 'b', label: "Key isn't 10" },
          { id: 'c', label: 'Key is 9' },
          { id: 'd', label: 'Key is 10 e Key is 9' },
        ],
        correctOptionId: 'a',
        explanation:
          'A condição key == 10 é verdadeira, então o bloco do if imprime "Key is 10".',
      },
      {
        id: 'cond-range-check',
        title: 'Faixa de valores',
        prompt:
          'Qual mensagem será impressa pelo código quando temperature = 18 considerando a cadeia if/else if?',
        code: `int temperature = 18;

if (temperature > 25) {
  cout << "Hot" << endl;
} else if (temperature >= 15) {
  cout << "Pleasant" << endl;
} else {
  cout << "Cold" << endl;
}`,
        options: [
          { id: 'a', label: 'Hot' },
          { id: 'b', label: 'Pleasant' },
          { id: 'c', label: 'Cold' },
          { id: 'd', label: 'Nenhuma saída' },
        ],
        correctOptionId: 'b',
        explanation:
          'temperature = 18 não passa pela primeira condição, mas satisfaz temperature >= 15, entrando no bloco Pleasant.',
      },
    ],
  },
  {
    id: 'unit-loops',
    title: 'Laços e repetição',
    description:
      'Explora o fluxo de execução em loops while/do-while e como evitar laços infinitos ao atualizar índices.',
    ability: 'Loops e iteração',
    difficulty: 'Intermediário',
    introContent: [
      'Laços repetem um bloco enquanto uma condição continuar verdadeira.',
      'É importante atualizar variáveis de controle para evitar loops infinitos.',
      'Veja como while e do/while se comportam quando a condição é avaliada antes ou depois do bloco.',
    ],
    items: [
      {
        id: 'loop-while-stall',
        title: 'Loop infinito',
        prompt:
          'O código abaixo deveria somar 1 dez vezes, mas algo ocorre. Qual opção descreve o comportamento?',
        code: `int index = 0;
int acc = 0;

while (index < 10) {
  acc += 1;
}

cout << acc << endl;`,
        options: [
          { id: 'a', label: 'Executa e imprime 10 como esperado' },
          { id: 'b', label: 'Entra em loop infinito porque index nunca é incrementado' },
          { id: 'c', label: 'Compila, mas imprime lixo de memória' },
          { id: 'd', label: 'Não compila porque acc não foi inicializado' },
        ],
        correctOptionId: 'b',
        explanation:
          'index permanece 0, mantendo a condição verdadeira para sempre e impedindo o cout de ser alcançado.',
      },
      {
        id: 'loop-fix',
        title: 'Corrigindo o laço',
        prompt: 'Qual alteração garante que acc termine valendo 10 apenas ao final da repetição?',
        code: `int index = 0;
int acc = 0;

while (index < 10) {
  acc += 1;
  // ?
}`,
        options: [
          { id: 'a', label: 'Adicionar index++; dentro do while' },
          { id: 'b', label: 'Trocar o while por if (index < 10)' },
          { id: 'c', label: 'Substituir acc += 1 por acc = 0' },
          { id: 'd', label: 'Mover cout para dentro do while' },
        ],
        correctOptionId: 'a',
        explanation:
          'Incrementar index altera a condição e encerra o loop após 10 iterações, preservando acc = 10.',
      },
      {
        id: 'loop-do-while',
        title: 'Escolhendo o laço adequado',
        prompt:
          'Queremos garantir pelo menos uma execução e ainda assim parar quando index >= 10. Qual estrutura atende ao requisito?',
        options: [
          { id: 'a', label: 'Utilizar do { ... } while (index < 10);' },
          { id: 'b', label: 'Usar um if no lugar do while' },
          { id: 'c', label: 'Trocar int index por float index' },
          { id: 'd', label: 'Remover totalmente a condição' },
        ],
        correctOptionId: 'a',
        explanation:
          'O laço do/while executa o bloco uma vez antes de avaliar a condição, atendendo ao requisito.',
      },
    ],
  },
];
