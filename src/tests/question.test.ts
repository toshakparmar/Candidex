import request from 'supertest';
import app from '../app';
import { QuestionType, DifficultyLevel, VisibilityType } from '../types/question.types';

describe('Question API Tests', () => {
    let createdQuestionId: string;

    /**
     * Test MCQ Question Creation
     */
    describe('POST /api/v1/questions - MCQ', () => {
        it('should create an MCQ question successfully', async () => {
            const mcqQuestion = {
                title: 'What is 2 + 2?',
                type: QuestionType.MCQ,
                category: 'Mathematics',
                difficulty: DifficultyLevel.EASY,
                visibility: VisibilityType.PUBLIC,
                tags: ['arithmetic', 'basic'],
                points: 10,
                estimatedTime: 2,
                negativeMarks: 2,
                explanation: 'Basic addition problem',
                content: {
                    questionContent: 'What is the result of 2 + 2?',
                    options: [
                        { id: 'opt_1', text: '3', isCorrect: false },
                        { id: 'opt_2', text: '4', isCorrect: true },
                        { id: 'opt_3', text: '5', isCorrect: false },
                        { id: 'opt_4', text: '22', isCorrect: false }
                    ]
                }
            };

            const response = await request(app)
                .post('/api/v1/questions')
                .send(mcqQuestion)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data.type).toBe(QuestionType.MCQ);
            expect(response.body.data.content.options).toHaveLength(4);

            createdQuestionId = response.body.data.id;
        });

        it('should fail without correct answer in options', async () => {
            const mcqQuestion = {
                title: 'Invalid MCQ',
                type: QuestionType.MCQ,
                category: 'Mathematics',
                difficulty: DifficultyLevel.EASY,
                visibility: VisibilityType.PUBLIC,
                points: 10,
                estimatedTime: 2,
                content: {
                    questionContent: 'Test question',
                    options: [
                        { id: 'opt_1', text: 'Option 1', isCorrect: false },
                        { id: 'opt_2', text: 'Option 2', isCorrect: false }
                    ]
                }
            };

            const response = await request(app)
                .post('/api/v1/questions')
                .send(mcqQuestion)
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    /**  
     * Test Programming Question Creation
     */
    describe('POST /api/v1/questions - Programming', () => {
        it('should create a programming question successfully', async () => {
            const programmingQuestion = {
                title: 'Implement Factorial Function',
                type: QuestionType.PROGRAMMING,
                category: 'Algorithms',
                difficulty: DifficultyLevel.MEDIUM,
                visibility: VisibilityType.PUBLIC,
                tags: ['recursion', 'mathematics'],
                points: 50,
                estimatedTime: 30,
                explanation: 'Calculate factorial of a number',
                content: {
                    questionContent: 'Write a function to calculate factorial of a given number',
                    programmingLanguage: 'JAVASCRIPT',
                    evaluationMode: 'AUTOMATIC',
                    timeLimit: 5000,
                    memoryLimit: 128,
                    codeTheme: 'LIGHT',
                    showTestCases: true,
                    allowDebugging: true,
                    starterCode: 'function solution() {\n  \n}',
                    testCases: [
                        {
                            id: 'tc_1',
                            input: '5',
                            expectedOutput: '120',
                            points: 25,
                            description: 'Test factorial of 5',
                            isHidden: false
                        },
                        {
                            id: 'tc_2',
                            input: '0',
                            expectedOutput: '1',
                            points: 25,
                            description: 'Test edge case: factorial of 0',
                            isHidden: true
                        }
                    ]
                }
            };

            const response = await request(app)
                .post('/api/v1/questions')
                .send(programmingQuestion)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.type).toBe(QuestionType.PROGRAMMING);
            expect(response.body.data.content.testCases).toHaveLength(2);
        });
    });

    /**
     *  Test Descriptive Question Creation
     */
    describe('POST /api/v1/questions - Descriptive', () => {
        it('should create a descriptive question successfully', async () => {
            const descriptiveQuestion = {
                title: 'Explain Photosynthesis',
                type: QuestionType.DESCRIPTIVE,
                category: 'Biology',
                difficulty: DifficultyLevel.MEDIUM,
                visibility: VisibilityType.PUBLIC,
                tags: ['biology', 'plants'],
                points: 20,
                estimatedTime: 15,
                content: {
                    questionContent: 'Explain the process of photosynthesis in detail',
                    minWords: 100,
                    maxWords: 500
                }
            };

            const response = await request(app)
                .post('/api/v1/questions')
                .send(descriptiveQuestion)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.type).toBe(QuestionType.DESCRIPTIVE);
        });

        it('should fail when maxWords < minWords', async () => {
            const descriptiveQuestion = {
                title: 'Invalid Descriptive',
                type: QuestionType.DESCRIPTIVE,
                category: 'Biology',
                difficulty: DifficultyLevel.MEDIUM,
                visibility: VisibilityType.PUBLIC,
                points: 20,
                estimatedTime: 15,
                content: {
                    questionContent: 'Test question',
                    minWords: 500,
                    maxWords: 100
                }
            };

            const response = await request(app)
                .post('/api/v1/questions')
                .send(descriptiveQuestion)
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    /**
     * Test Image-Based Question Creation
     */
    describe('POST /api/v1/questions - Image Based', () => {
        it('should create an image-based question successfully', async () => {
            const imageQuestion = {
                title: 'Identify the Triangle',
                type: QuestionType.IMAGE_BASED,
                category: 'Geometry',
                difficulty: DifficultyLevel.EASY,
                visibility: VisibilityType.PUBLIC,
                tags: ['geometry', 'shapes'],
                points: 15,
                estimatedTime: 5,
                content: {
                    questionContent: 'Which of the following is an equilateral triangle?',
                    questionImageUrl: 'https://example.com/question.jpg',
                    questionImageAlt: 'Triangle question',
                    options: [
                        {
                            id: 'img_opt_1',
                            imageUrl: 'https://example.com/triangle1.jpg',
                            altText: 'Scalene triangle',
                            isCorrect: false
                        },
                        {
                            id: 'img_opt_2',
                            imageUrl: 'https://example.com/triangle2.jpg',
                            altText: 'Equilateral triangle',
                            isCorrect: true
                        },
                        {
                            id: 'img_opt_3',
                            imageUrl: 'https://example.com/triangle3.jpg',
                            altText: 'Isosceles triangle',
                            isCorrect: false
                        }
                    ],
                    displaySettings: {
                        allowZoom: true,
                        showLabels: true,
                        showTextDescriptions: false,
                        randomizeOrder: false
                    }
                }
            };

            const response = await request(app)
                .post('/api/v1/questions')
                .send(imageQuestion)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.type).toBe(QuestionType.IMAGE_BASED);
            expect(response.body.data.content.displaySettings).toBeDefined();
        });
    });

    /** 
     * Test Get Question by ID
     */
    describe('GET /api/v1/questions/:id', () => {
        it('should get question by ID', async () => {
            const response = await request(app)
                .get(`/api/v1/questions/${createdQuestionId}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(createdQuestionId);
        });

        it('should return 404 for non-existent question', async () => {
            const fakeId = '123e4567-e89b-12d3-a456-426614174000';
            const response = await request(app)
                .get(`/api/v1/questions/${fakeId}`)
                .expect(404);

            expect(response.body.success).toBe(false);
        });
    });

    /**
     * Test Get All Questions with Filtering
     */
    describe('GET /api/v1/questions', () => {
        it('should get all questions with pagination', async () => {
            const response = await request(app)
                .get('/api/v1/questions?page=1&limit=10')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.pagination).toBeDefined();
            expect(response.body.pagination.currentPage).toBe(1);
        });

        it('should filter questions by type', async () => {
            const response = await request(app)
                .get(`/api/v1/questions?type=${QuestionType.MCQ}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            response.body.data.forEach((q: any) => {
                expect(q.type).toBe(QuestionType.MCQ);
            });
        });

        it('should filter questions by difficulty', async () => {
            const response = await request(app)
                .get(`/api/v1/questions?difficulty=${DifficultyLevel.EASY}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            response.body.data.forEach((q: any) => {
                expect(q.difficulty).toBe(DifficultyLevel.EASY);
            });
        });
    });

    /**
     * Test Update Question
     */
    describe('PUT /api/v1/questions/:id', () => {
        it('should update question successfully', async () => {
            const updateData = {
                title: 'Updated Question Title',
                points: 15
            };

            const response = await request(app)
                .put(`/api/v1/questions/${createdQuestionId}`)
                .send(updateData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.title).toBe('Updated Question Title');
            expect(response.body.data.points).toBe(15);
        });
    });

    /**
     * Test Delete Question
     */
    describe('DELETE /api/v1/questions/:id', () => {
        it('should delete question successfully', async () => {
            const response = await request(app)
                .delete(`/api/v1/questions/${createdQuestionId}`)
                .expect(200);

            expect(response.body.success).toBe(true);
        });

        it('should return 404 when trying to get deleted question', async () => {
            await request(app)
                .get(`/api/v1/questions/${createdQuestionId}`)
                .expect(404);
        });
    });

    /**
     * Test Validation Errors
     */
    describe('Validation Tests', () => {
        it('should fail with missing required fields', async () => {
            const invalidQuestion = {
                title: 'Test'
                // Missing other required fields
            };

            const response = await request(app)
                .post('/api/v1/questions')
                .send(invalidQuestion)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
        });

        it('should fail with invalid question type', async () => {
            const invalidQuestion = {
                title: 'Test Question',
                type: 'INVALID_TYPE',
                category: 'Test',
                difficulty: DifficultyLevel.EASY,
                visibility: VisibilityType.PUBLIC,
                points: 10,
                estimatedTime: 5,
                content: {}
            };

            const response = await request(app)
                .post('/api/v1/questions')
                .send(invalidQuestion)
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });
});