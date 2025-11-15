import { Router } from 'express';
import questionController from '../controllers/question.controller';
import {
    baseQuestionValidators,
    mcqContentValidators,
    programmingContentValidators,
    descriptiveContentValidators,
    imageBasedContentValidators,
    questionQueryValidators,
    questionIdValidator
} from '../validators/question.validator';
import {
    QuestionType,
    UpdateQuestionNext,
    UpdateQuestionRequest,
    UpdateQuestionResponse
} from '../types/question.types';
import { body } from 'express-validator';

const router = Router();

const getContentValidators = (req: any, _res: any, next: any) => {
    const questionType = req.body.type;

    if (!questionType) {
        return next();
    }

    let validators;
    switch (questionType) {
        case QuestionType.MCQ:
            validators = mcqContentValidators;
            break;
        case QuestionType.PROGRAMMING:
            validators = programmingContentValidators;
            break;
        case QuestionType.DESCRIPTIVE:
            validators = descriptiveContentValidators;
            break;
        case QuestionType.IMAGE_BASED:
            validators = imageBasedContentValidators;
            break;
        default:
            return next();
    }

    Promise.all(validators.map((validator: any) => validator.run(req)))
        .then(() => next())
        .catch(next);
};

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Question management API
 */

/**
 * POST /api/v1/questions
 * Create a new question
 */
router.post(
    '/',
    baseQuestionValidators,
    getContentValidators,
    questionController.createQuestion.bind(questionController)
);

/**
 * GET /api/v1/questions
 * Get all questions with pagination and filtering
 */
router.get(
    '/',
    questionQueryValidators,
    questionController.getAllQuestions.bind(questionController)
);

/**
 * GET /api/v1/questions/:id
 * Get question by ID
 */
router.get(
    '/:id',
    questionIdValidator,
    questionController.getQuestionById.bind(questionController)
);

/**
 * PUT /api/v1/questions/:id
 * Update question
 */
router.put(
    '/:id',
    questionIdValidator,
    body('type').optional(),
    (req: UpdateQuestionRequest, res: UpdateQuestionResponse, next: UpdateQuestionNext) => {
        if (req.body.content) {
            return getContentValidators(req as any, res as any, next);
        }
        next();
    },
    questionController.updateQuestion.bind(questionController)
);

/**
 * DELETE /api/v1/questions/:id
 * Delete question
 */
router.delete(
    '/:id',
    questionIdValidator,
    questionController.deleteQuestion.bind(questionController)
);

/**
 * GET /api/v1/questions/category/:category
 * Get questions by category
 */
router.get(
    '/category/:category',
    questionController.getQuestionsByCategory.bind(questionController)
);

/**
 * GET /api/v1/questions/type/:type
 * Get questions by type
 */
router.get(
    '/type/:type',
    questionController.getQuestionsByType.bind(questionController)
);

export default router;