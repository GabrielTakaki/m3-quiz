export type DifficultyLevel = 'Iniciante' | 'Intermediário' | 'Avançado' | string;

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
