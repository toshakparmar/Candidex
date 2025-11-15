/**
 * Question Types and Interfaces
 */
export enum QuestionType {
  MCQ = 'MCQ',
  PROGRAMMING = 'PROGRAMMING',
  DESCRIPTIVE = 'DESCRIPTIVE',
  IMAGE_BASED = 'IMAGE_BASED'
}

/**
 * Difficulty Levels
 */
export enum DifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

/**
 * Visibility Types
 */
export enum VisibilityType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

/**
 * Programming Languages
 */
export enum ProgrammingLanguage {
  JAVASCRIPT = 'JAVASCRIPT',
  PYTHON = 'PYTHON',
  JAVA = 'JAVA',
  CPP = 'CPP',
  C = 'C',
  CSHARP = 'CSHARP',
  GO = 'GO',
  RUST = 'RUST'
}

/**
 * Evaluation Modes
 */
export enum EvaluationMode {
  AUTOMATIC = 'AUTOMATIC',
  MANUAL = 'MANUAL'
}

/**
 * Code Themes
 */
export enum CodeTheme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  MONOKAI = 'MONOKAI',
  DRACULA = 'DRACULA'
}

/**
 * Base Question Interface
 */
export interface IBaseQuestion {
  id?: string;
  title: string;
  category: string;
  difficulty: DifficultyLevel;
  visibility: VisibilityType;
  tags?: string[];
  points: number;
  estimatedTime: number;
  negativeMarks?: number;
  explanation?: string;
  authorNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * MCQ Option Interface
 */
export interface IMCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

/**
 * MCQ Content Interface
 */
export interface IMCQContent {
  questionContent: string;
  options: IMCQOption[];
}

/**
 * MCQ Question Interface
 */
export interface IMCQQuestion extends IBaseQuestion {
  type: QuestionType.MCQ;
  content: IMCQContent;
}

/**
 * Test Case Interface for Programming Questions
 */
export interface ITestCase {
  id: string;
  input: string;
  expectedOutput: string;
  points: number;
  description?: string;
  isHidden: boolean;
}

/**
 * Programming Content Interface
 */
export interface IProgrammingContent {
  questionContent: string;
  programmingLanguage: ProgrammingLanguage;
  evaluationMode: EvaluationMode;
  timeLimit: number; // in milliseconds
  memoryLimit: number; // in MB
  codeTheme: CodeTheme;
  showTestCases: boolean;
  allowDebugging: boolean;
  starterCode?: string;
  testCases: ITestCase[];
}

/**
 * Programming Question Interface
 */
export interface IProgrammingQuestion extends IBaseQuestion {
  type: QuestionType.PROGRAMMING;
  content: IProgrammingContent;
}

/**
 * Descriptive Content Interface
 */
export interface IDescriptiveContent {
  questionContent: string;
  wordLimit?: number;
  minWords?: number;
  maxWords?: number;
}

/**
 * Descriptive Question Interface
 */
export interface IDescriptiveQuestion extends IBaseQuestion {
  type: QuestionType.DESCRIPTIVE;
  content: IDescriptiveContent;
}

/**
 * Image Option Interface
 */
export interface IImageOption {
  id: string;
  imageUrl: string;
  altText?: string;
  isCorrect: boolean;
}

/**
 * Image Display Settings Interface
 */
export interface IImageDisplaySettings {
  allowZoom: boolean;
  showLabels: boolean;
  showTextDescriptions: boolean;
  randomizeOrder: boolean;
}

/**
 * Image Based Content Interface
 */
export interface IImageBasedContent {
  questionContent: string;
  questionImageUrl?: string;
  questionImageAlt?: string;
  options: IImageOption[];
  displaySettings: IImageDisplaySettings;
}

/**
 * Image Based Question Interface
 */
export interface IImageBasedQuestion extends IBaseQuestion {
  type: QuestionType.IMAGE_BASED;
  content: IImageBasedContent;
}

/**
 * Union Type for All Question Interfaces
 */
export type IQuestion =
  | IMCQQuestion
  | IProgrammingQuestion
  | IDescriptiveQuestion
  | IImageBasedQuestion;

/**
 * Question Request DTOs
 */
export interface ICreateQuestionRequest {
  title: string;
  type: QuestionType;
  category: string;
  difficulty: DifficultyLevel;
  visibility: VisibilityType;
  tags?: string[];
  points: number;
  estimatedTime: number;
  negativeMarks?: number;
  explanation?: string;
  authorNotes?: string;
  content:
  | IMCQContent
  | IProgrammingContent
  | IDescriptiveContent
  | IImageBasedContent;
}

/**
 * Update Question Request DTO
 */
export interface IUpdateQuestionRequest extends Partial<ICreateQuestionRequest> {
  id: string;
}

/**
 * Question Response DTOs
 */
export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

/**
 * Paginated Response Interface
 */
export interface IPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

/**
 * Question Query Parameters Interface
 */
export interface IQuestionQueryParams {
  page?: number;
  limit?: number;
  type?: QuestionType;
  category?: string;
  difficulty?: DifficultyLevel;
  visibility?: VisibilityType;
  tags?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Types for Update Question Middleware
 */
export interface UpdateQuestionRequest {
  body: {
    type?: QuestionType;
    content?: any;
    [key: string]: any;
  };
  params: {
    id: string;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Response type for Update Question Middleware
 */
export interface UpdateQuestionResponse {
  status: (code: number) => UpdateQuestionResponse;
  json: (body: any) => UpdateQuestionResponse;
  [key: string]: any;
}

/**
 * Next function type for Update Question Middleware
 */
export type UpdateQuestionNext = (err?: any) => void;