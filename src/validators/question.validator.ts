import { body, param, query, ValidationChain } from 'express-validator';
import {
  QuestionType,
  DifficultyLevel,
  VisibilityType,
  ProgrammingLanguage,
  EvaluationMode,
  CodeTheme
} from '../types/question.types';

/**
 * Base question validators
 * Applies to all question types
 */
export const baseQuestionValidators: ValidationChain[] = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 500 })
    .withMessage('Title must be between 3 and 500 characters'),

  body('type')
    .notEmpty()
    .withMessage('Question type is required')
    .isIn(Object.values(QuestionType))
    .withMessage('Invalid question type'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Category must be between 2 and 100 characters'),

  body('difficulty')
    .notEmpty()
    .withMessage('Difficulty is required')
    .isIn(Object.values(DifficultyLevel))
    .withMessage('Invalid difficulty level'),

  body('visibility')
    .notEmpty()
    .withMessage('Visibility is required')
    .isIn(Object.values(VisibilityType))
    .withMessage('Invalid visibility type'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Each tag must be between 2 and 50 characters'),

  body('points')
    .notEmpty()
    .withMessage('Points are required')
    .isInt({ min: 0, max: 1000 })
    .withMessage('Points must be between 0 and 1000'),

  body('estimatedTime')
    .notEmpty()
    .withMessage('Estimated time is required')
    .isInt({ min: 1, max: 1440 })
    .withMessage('Estimated time must be between 1 and 1440 minutes'),

  body('negativeMarks')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Negative marks must be between 0 and 100'),

  body('explanation')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Explanation must not exceed 5000 characters'),

  body('authorNotes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Author notes must not exceed 2000 characters')
];

/**
 * MCQ specific validators
 * Applies to MCQ question type
 */
export const mcqContentValidators: ValidationChain[] = [
  body('content.questionContent')
    .trim()
    .notEmpty()
    .withMessage('Question content is required')
    .isLength({ min: 10, max: 10000 })
    .withMessage('Question content must be between 10 and 10000 characters'),

  body('content.options')
    .notEmpty()
    .withMessage('Options are required')
    .isArray({ min: 2, max: 10 })
    .withMessage('Must have between 2 and 10 options'),

  body('content.options.*.id')
    .trim()
    .notEmpty()
    .withMessage('Option ID is required'),

  body('content.options.*.text')
    .trim()
    .notEmpty()
    .withMessage('Option text is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Option text must be between 1 and 1000 characters'),

  body('content.options.*.isCorrect')
    .isBoolean()
    .withMessage('isCorrect must be a boolean'),

  body('content.options')
    .custom((options) => {
      const correctAnswers = options.filter((opt: any) => opt.isCorrect);
      if (correctAnswers.length === 0) {
        throw new Error('At least one option must be marked as correct');
      }
      return true;
    })
];

/**
 * Programming specific validators
 * Applies to Programming question type
 */
export const programmingContentValidators: ValidationChain[] = [
  body('content.questionContent')
    .trim()
    .notEmpty()
    .withMessage('Question content is required')
    .isLength({ min: 10, max: 10000 })
    .withMessage('Question content must be between 10 and 10000 characters'),

  body('content.programmingLanguage')
    .notEmpty()
    .withMessage('Programming language is required')
    .isIn(Object.values(ProgrammingLanguage))
    .withMessage('Invalid programming language'),

  body('content.evaluationMode')
    .notEmpty()
    .withMessage('Evaluation mode is required')
    .isIn(Object.values(EvaluationMode))
    .withMessage('Invalid evaluation mode'),

  body('content.timeLimit')
    .notEmpty()
    .withMessage('Time limit is required')
    .isInt({ min: 100, max: 30000 })
    .withMessage('Time limit must be between 100 and 30000 milliseconds'),

  body('content.memoryLimit')
    .notEmpty()
    .withMessage('Memory limit is required')
    .isInt({ min: 16, max: 1024 })
    .withMessage('Memory limit must be between 16 and 1024 MB'),

  body('content.codeTheme')
    .notEmpty()
    .withMessage('Code theme is required')
    .isIn(Object.values(CodeTheme))
    .withMessage('Invalid code theme'),

  body('content.showTestCases')
    .isBoolean()
    .withMessage('showTestCases must be a boolean'),

  body('content.allowDebugging')
    .isBoolean()
    .withMessage('allowDebugging must be a boolean'),

  body('content.starterCode')
    .optional()
    .trim()
    .isLength({ max: 10000 })
    .withMessage('Starter code must not exceed 10000 characters'),

  body('content.testCases')
    .notEmpty()
    .withMessage('Test cases are required')
    .isArray({ min: 1, max: 50 })
    .withMessage('Must have between 1 and 50 test cases'),

  body('content.testCases.*.id')
    .trim()
    .notEmpty()
    .withMessage('Test case ID is required'),

  body('content.testCases.*.input')
    .notEmpty()
    .withMessage('Test case input is required'),

  body('content.testCases.*.expectedOutput')
    .notEmpty()
    .withMessage('Expected output is required'),

  body('content.testCases.*.points')
    .isInt({ min: 0, max: 100 })
    .withMessage('Test case points must be between 0 and 100'),

  body('content.testCases.*.description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Test case description must not exceed 500 characters'),

  body('content.testCases.*.isHidden')
    .isBoolean()
    .withMessage('isHidden must be a boolean')
];

/**
 * Descriptive specific validators
 * Applies to Descriptive question type 
 */
export const descriptiveContentValidators: ValidationChain[] = [
  body('content.questionContent')
    .trim()
    .notEmpty()
    .withMessage('Question content is required')
    .isLength({ min: 10, max: 10000 })
    .withMessage('Question content must be between 10 and 10000 characters'),

  body('content.wordLimit')
    .optional()
    .isInt({ min: 10, max: 10000 })
    .withMessage('Word limit must be between 10 and 10000'),

  body('content.minWords')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('Minimum words must be between 1 and 10000'),

  body('content.maxWords')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('Maximum words must be between 1 and 10000')
    .custom((value, { req }) => {
      if (req.body.content.minWords && value < req.body.content.minWords) {
        throw new Error('Maximum words must be greater than minimum words');
      }
      return true;
    })
];

/**
 * ImageBased specific validators
 * Applies to ImageBased question type
 */
export const imageBasedContentValidators: ValidationChain[] = [
  body('content.questionContent')
    .trim()
    .notEmpty()
    .withMessage('Question content is required')
    .isLength({ min: 10, max: 10000 })
    .withMessage('Question content must be between 10 and 10000 characters'),

  body('content.questionImageUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Question image URL must be a valid URL'),

  body('content.questionImageAlt')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Question image alt text must not exceed 500 characters'),

  body('content.options')
    .notEmpty()
    .withMessage('Options are required')
    .isArray({ min: 2, max: 10 })
    .withMessage('Must have between 2 and 10 options'),

  body('content.options.*.id')
    .trim()
    .notEmpty()
    .withMessage('Option ID is required'),

  body('content.options.*.imageUrl')
    .trim()
    .notEmpty()
    .withMessage('Option image URL is required')
    .isURL()
    .withMessage('Option image URL must be a valid URL'),

  body('content.options.*.altText')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Alt text must not exceed 500 characters'),

  body('content.options.*.isCorrect')
    .isBoolean()
    .withMessage('isCorrect must be a boolean'),

  body('content.options')
    .custom((options) => {
      const correctAnswers = options.filter((opt: any) => opt.isCorrect);
      if (correctAnswers.length === 0) {
        throw new Error('At least one option must be marked as correct');
      }
      return true;
    }),

  body('content.displaySettings.allowZoom')
    .isBoolean()
    .withMessage('allowZoom must be a boolean'),

  body('content.displaySettings.showLabels')
    .isBoolean()
    .withMessage('showLabels must be a boolean'),

  body('content.displaySettings.showTextDescriptions')
    .isBoolean()
    .withMessage('showTextDescriptions must be a boolean'),

  body('content.displaySettings.randomizeOrder')
    .isBoolean()
    .withMessage('randomizeOrder must be a boolean')
];

/**
 * Query parameter validators for fetching questions
 */
export const questionQueryValidators: ValidationChain[] = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('type')
    .optional()
    .isIn(Object.values(QuestionType))
    .withMessage('Invalid question type'),

  query('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category must be between 2 and 100 characters'),

  query('difficulty')
    .optional()
    .isIn(Object.values(DifficultyLevel))
    .withMessage('Invalid difficulty level'),

  query('visibility')
    .optional()
    .isIn(Object.values(VisibilityType))
    .withMessage('Invalid visibility type'),

  query('tags')
    .optional()
    .trim(),

  query('sortBy')
    .optional()
    .trim()
    .isIn(['title', 'createdAt', 'updatedAt', 'points', 'difficulty'])
    .withMessage('Invalid sort field'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];

/**
 * Validator for question ID parameter
 */
export const questionIdValidator: ValidationChain[] = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Question ID is required')
    .isUUID()
    .withMessage('Invalid question ID format')
];