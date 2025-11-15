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
  items: QuizItemDefinition[];
}

export const quizUnits: QuizUnitDefinition[] = [
  {
    id: 'unit-intro',
    title: 'Fundamentos do Console',
    description:
      'Introdução aos tipos numéricos básicos, declarações simples e à função cout para imprimir valores.',
    ability: 'Sintaxe básica e I/O',
    difficulty: 'Iniciante',
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
