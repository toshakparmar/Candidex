import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import questionService from '../services/question.service';
import { ICreateQuestionRequest, IQuestionQueryParams } from '../types/question.types';
import { AppError } from '../utils/errors';

/**
 * Question Controller
 */
export class QuestionController {
    /**
     * @swagger
     * /api/v1/questions:
     *   post:
     *     summary: Create a new question
     *     tags: [Questions]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateQuestionRequest'
     *     responses:
     *       201:
     *         description: Question created successfully
     *       400:
     *         description: Invalid request data
     *       500:
     *         description: Internal server error
     */
    async createQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new AppError('Validation failed', 400, errors.array());
            }

            const questionData: ICreateQuestionRequest = req.body;
            const question = await questionService.createQuestion(questionData);

            res.status(201).json({
                success: true,
                message: 'Question created successfully',
                data: question
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /api/v1/questions/{id}:
     *   get:
     *     summary: Get question by ID
     *     tags: [Questions]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Question fetched successfully
     *       404:
     *         description: Question not found
     */
    async getQuestionById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new AppError('Validation failed', 400, errors.array());
            }

            const { id } = req.params;
            const question = await questionService.getQuestionById(id);

            res.status(200).json({
                success: true,
                message: 'Question fetched successfully',
                data: question
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /api/v1/questions:
     *   get:
     *     summary: Get all questions with pagination and filters
     *     tags: [Questions]
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           minimum: 1
     *           default: 1
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           minimum: 1
     *           maximum: 100
     *           default: 10
     *       - in: query
     *         name: type
     *         schema:
     *           type: string
     *           enum: [MCQ, PROGRAMMING, DESCRIPTIVE, IMAGE_BASED]
     *       - in: query
     *         name: category
     *         schema:
     *           type: string
     *       - in: query
     *         name: difficulty
     *         schema:
     *           type: string
     *           enum: [EASY, MEDIUM, HARD]
     *       - in: query
     *         name: visibility
     *         schema:
     *           type: string
     *           enum: [PUBLIC, PRIVATE]
     *       - in: query
     *         name: tags
     *         schema:
     *           type: string
     *           description: Comma-separated tags
     *       - in: query
     *         name: sortBy
     *         schema:
     *           type: string
     *           enum: [title, createdAt, updatedAt, points, difficulty]
     *           default: createdAt
     *       - in: query
     *         name: sortOrder
     *         schema:
     *           type: string
     *           enum: [asc, desc]
     *           default: desc
     *     responses:
     *       200:
     *         description: Questions fetched successfully
     */
    async getAllQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new AppError('Validation failed', 400, errors.array());
            }

            const queryParams: IQuestionQueryParams = {
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
                type: req.query.type as any,
                category: req.query.category as string,
                difficulty: req.query.difficulty as any,
                visibility: req.query.visibility as any,
                tags: req.query.tags as string,
                sortBy: req.query.sortBy as string || 'createdAt',
                sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
            };

            const result = await questionService.getAllQuestions(queryParams);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /api/v1/questions/{id}:
     *   put:
     *     summary: Update question
     *     tags: [Questions]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateQuestionRequest'
     *     responses:
     *       200:
     *         description: Question updated successfully
     *       404:
     *         description: Question not found
     */
    async updateQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new AppError('Validation failed', 400, errors.array());
            }

            const { id } = req.params;
            const updateData = req.body;

            const question = await questionService.updateQuestion(id, updateData);

            res.status(200).json({
                success: true,
                message: 'Question updated successfully',
                data: question
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /api/v1/questions/{id}:
     *   delete:
     *     summary: Delete question
     *     tags: [Questions]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Question deleted successfully
     *       404:
     *         description: Question not found
     */
    async deleteQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new AppError('Validation failed', 400, errors.array());
            }

            const { id } = req.params;
            await questionService.deleteQuestion(id);

            res.status(200).json({
                success: true,
                message: 'Question deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /api/v1/questions/category/{category}:
     *   get:
     *     summary: Get questions by category
     *     tags: [Questions]
     *     parameters:
     *       - in: path
     *         name: category
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Questions fetched successfully
     */
    async getQuestionsByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { category } = req.params;
            const questions = await questionService.getQuestionsByCategory(category);

            res.status(200).json({
                success: true,
                message: 'Questions fetched successfully',
                data: questions
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /api/v1/questions/type/{type}:
     *   get:
     *     summary: Get questions by type
     *     tags: [Questions]
     *     parameters:
     *       - in: path
     *         name: type
     *         required: true
     *         schema:
     *           type: string
     *           enum: [MCQ, PROGRAMMING, DESCRIPTIVE, IMAGE_BASED]
     *     responses:
     *       200:
     *         description: Questions fetched successfully
     */
    async getQuestionsByType(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { type } = req.params;
            const questions = await questionService.getQuestionsByType(type as any);

            res.status(200).json({
                success: true,
                message: 'Questions fetched successfully',
                data: questions
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new QuestionController();