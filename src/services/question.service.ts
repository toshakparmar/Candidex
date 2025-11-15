import { AppError } from '../utils/errors';
import logger from '../utils/logger';
import prisma from '../prismaClient';
import {
    ICreateQuestionRequest,
    IQuestionQueryParams,
    IPaginatedResponse,
    QuestionType,
    IQuestion
} from '../types/question.types';

/**
 * Question Service
 */
export class QuestionService {
    constructor() { }

    /**
     * Validate question content based on type
     * @param type 
     * @param content 
     */
    private validateQuestionContent(type: QuestionType, content: any): void {
        switch (type) {
            case QuestionType.MCQ:
                if (!content.questionContent || !content.options) {
                    throw new AppError('Invalid MCQ content structure', 400);
                }
                break;
            case QuestionType.PROGRAMMING:
                if (!content.questionContent || !content.programmingLanguage || !content.testCases) {
                    throw new AppError('Invalid Programming content structure', 400);
                }
                break;
            case QuestionType.DESCRIPTIVE:
                if (!content.questionContent) {
                    throw new AppError('Invalid Descriptive content structure', 400);
                }
                break;
            case QuestionType.IMAGE_BASED:
                if (!content.questionContent || !content.options || !content.displaySettings) {
                    throw new AppError('Invalid Image-based content structure', 400);
                }
                break;
            default:
                throw new AppError('Unknown question type', 400);
        }
    }

    /**
     * Create a new question
     * @param data 
     * @returns 
     */
    async createQuestion(data: ICreateQuestionRequest): Promise<IQuestion> {
        try {
            logger.info('Creating new question', { type: data.type, title: data.title });

            this.validateQuestionContent(data.type, data.content);

            const created = await prisma.question.create({
                data: {
                    title: data.title,
                    type: data.type,
                    category: data.category,
                    difficulty: data.difficulty,
                    visibility: data.visibility,
                    tags: data.tags || [],
                    points: data.points,
                    estimatedTime: data.estimatedTime,
                    negativeMarks: data.negativeMarks || 0,
                    explanation: data.explanation,
                    authorNotes: data.authorNotes,
                    content: data.content as any
                }
            });

            logger.info('Question created successfully', { id: created.id });
            return created as unknown as IQuestion;
        } catch (error) {
            logger.error('Error creating question', { error });
            throw error;
        }
    }

    /**
     * Get question by ID
     * @param id 
     * @returns 
     */
    async getQuestionById(id: string): Promise<IQuestion> {
        const found = await prisma.question.findUnique({ where: { id } });
        if (!found) throw new AppError('Question not found', 404);
        return found as unknown as IQuestion;
    }

    /**
     * Get all questions with pagination and filtering
     * @param params 
     * @returns 
     */
    async getAllQuestions(params: IQuestionQueryParams): Promise<IPaginatedResponse<IQuestion>> {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (params.type) where.type = params.type;
        if (params.category) where.category = { contains: params.category, mode: 'insensitive' };
        if (params.difficulty) where.difficulty = params.difficulty;
        if (params.visibility) where.visibility = params.visibility;
        if (params.tags) {
            const tags = params.tags.split(',').map(t => t.trim().toLowerCase());
            where.AND = tags.map((t: string) => ({ tags: { has: t } }));
        }

        const orderBy: any = {};
        if (params.sortBy) {
            const direction = params.sortOrder === 'asc' ? 'asc' : 'desc';
            orderBy[params.sortBy] = direction;
        } else {
            orderBy['createdAt'] = 'desc';
        }

        const totalItems = await prisma.question.count({ where });
        const data = await prisma.question.findMany({ where, skip, take: limit, orderBy });

        return {
            success: true,
            message: 'Questions fetched successfully',
            data: data as unknown as IQuestion[],
            pagination: {
                currentPage: page,
                pageSize: limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit)
            }
        };
    }

    /**
     * Update question by ID
     * @param id 
     * @param data 
     * @returns 
     */
    async updateQuestion(id: string, data: Partial<ICreateQuestionRequest>): Promise<IQuestion> {
        const existing = await prisma.question.findUnique({ where: { id } });
        if (!existing) throw new AppError('Question not found', 404);

        if (data.content && data.type) this.validateQuestionContent(data.type, data.content);

        const updated = await prisma.question.update({ where: { id }, data: { ...data, updatedAt: new Date() } as any });
        return updated as unknown as IQuestion;
    }

    /**
     * Delete question by ID
     * @param id 
     */
    async deleteQuestion(id: string): Promise<void> {
        const existing = await prisma.question.findUnique({ where: { id } });
        if (!existing) throw new AppError('Question not found', 404);
        await prisma.question.delete({ where: { id } });
    }

    /**
     * Get questions by category
     * @param category 
     * @returns 
     */
    async getQuestionsByCategory(category: string): Promise<IQuestion[]> {
        const data = await prisma.question.findMany({ where: { category: { contains: category, mode: 'insensitive' } } });
        return data as unknown as IQuestion[];
    }

    /**
     * Get questions by type
     * @param type 
     * @returns 
     */
    async getQuestionsByType(type: QuestionType): Promise<IQuestion[]> {
        const data = await prisma.question.findMany({ where: { type } });
        return data as unknown as IQuestion[];
    }
}

export default new QuestionService();