import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Question Management API',
      version: '1.0.0',
      description: 'A comprehensive API for managing different types of questions (MCQ, Programming, Descriptive, Image-based)',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'https://candidex.onrender.com',
        description: 'Deployed API (Render) - use this to try endpoints'
      }
    ],
    components: {
      schemas: {
        QuestionType: {
          type: 'string',
          enum: ['MCQ', 'PROGRAMMING', 'DESCRIPTIVE', 'IMAGE_BASED']
        },
        DifficultyLevel: {
          type: 'string',
          enum: ['EASY', 'MEDIUM', 'HARD']
        },
        VisibilityType: {
          type: 'string',
          enum: ['PUBLIC', 'PRIVATE']
        },
        MCQOption: {
          type: 'object',
          required: ['id', 'text', 'isCorrect'],
          properties: {
            id: { type: 'string', example: 'opt_1' },
            text: { type: 'string', example: 'Option A' },
            isCorrect: { type: 'boolean', example: false }
          }
        },
        MCQContent: {
          type: 'object',
          required: ['questionContent', 'options'],
          properties: {
            questionContent: { type: 'string', example: 'What is 2+2?' },
            options: {
              type: 'array',
              items: { $ref: '#/components/schemas/MCQOption' }
            }
          }
        },
        TestCase: {
          type: 'object',
          required: ['id', 'input', 'expectedOutput', 'points', 'isHidden'],
          properties: {
            id: { type: 'string', example: 'tc_1' },
            input: { type: 'string', example: '5' },
            expectedOutput: { type: 'string', example: '120' },
            points: { type: 'integer', example: 10 },
            description: { type: 'string', example: 'Test basic factorial' },
            isHidden: { type: 'boolean', example: false }
          }
        },
        ProgrammingContent: {
          type: 'object',
          required: ['questionContent', 'programmingLanguage', 'evaluationMode', 'timeLimit', 'memoryLimit', 'codeTheme', 'showTestCases', 'allowDebugging', 'testCases'],
          properties: {
            questionContent: { type: 'string' },
            programmingLanguage: { type: 'string', enum: ['JAVASCRIPT', 'PYTHON', 'JAVA', 'CPP', 'C', 'CSHARP', 'GO', 'RUST'] },
            evaluationMode: { type: 'string', enum: ['AUTOMATIC', 'MANUAL'] },
            timeLimit: { type: 'integer', example: 5000 },
            memoryLimit: { type: 'integer', example: 128 },
            codeTheme: { type: 'string', enum: ['LIGHT', 'DARK', 'MONOKAI', 'DRACULA'] },
            showTestCases: { type: 'boolean', example: true },
            allowDebugging: { type: 'boolean', example: true },
            starterCode: { type: 'string', example: 'function solution() {\n  \n}' },
            testCases: {
              type: 'array',
              items: { $ref: '#/components/schemas/TestCase' }
            }
          }
        },
        DescriptiveContent: {
          type: 'object',
          required: ['questionContent'],
          properties: {
            questionContent: { type: 'string' },
            wordLimit: { type: 'integer', example: 500 },
            minWords: { type: 'integer', example: 100 },
            maxWords: { type: 'integer', example: 500 }
          }
        },
        ImageOption: {
          type: 'object',
          required: ['id', 'imageUrl', 'isCorrect'],
          properties: {
            id: { type: 'string', example: 'img_opt_1' },
            imageUrl: { type: 'string', format: 'uri', example: 'https://example.com/image1.jpg' },
            altText: { type: 'string', example: 'Image description' },
            isCorrect: { type: 'boolean', example: false }
          }
        },
        ImageDisplaySettings: {
          type: 'object',
          required: ['allowZoom', 'showLabels', 'showTextDescriptions', 'randomizeOrder'],
          properties: {
            allowZoom: { type: 'boolean', example: true },
            showLabels: { type: 'boolean', example: true },
            showTextDescriptions: { type: 'boolean', example: false },
            randomizeOrder: { type: 'boolean', example: false }
          }
        },
        ImageBasedContent: {
          type: 'object',
          required: ['questionContent', 'options', 'displaySettings'],
          properties: {
            questionContent: { type: 'string' },
            questionImageUrl: { type: 'string', format: 'uri' },
            questionImageAlt: { type: 'string' },
            options: {
              type: 'array',
              items: { $ref: '#/components/schemas/ImageOption' }
            },
            displaySettings: { $ref: '#/components/schemas/ImageDisplaySettings' }
          }
        },
        CreateQuestionRequest: {
          type: 'object',
          required: ['title', 'type', 'category', 'difficulty', 'visibility', 'points', 'estimatedTime', 'content'],
          properties: {
            title: { type: 'string', example: 'Basic Algebra Question' },
            type: { $ref: '#/components/schemas/QuestionType' },
            category: { type: 'string', example: 'Mathematics' },
            difficulty: { $ref: '#/components/schemas/DifficultyLevel' },
            visibility: { $ref: '#/components/schemas/VisibilityType' },
            tags: { type: 'array', items: { type: 'string' }, example: ['algebra', 'basic'] },
            points: { type: 'integer', example: 10 },
            estimatedTime: { type: 'integer', example: 5 },
            negativeMarks: { type: 'integer', example: 0 },
            explanation: { type: 'string' },
            authorNotes: { type: 'string' },
            content: {
              oneOf: [
                { $ref: '#/components/schemas/MCQContent' },
                { $ref: '#/components/schemas/ProgrammingContent' },
                { $ref: '#/components/schemas/DescriptiveContent' },
                { $ref: '#/components/schemas/ImageBasedContent' }
              ]
            }
          }
        },
        UpdateQuestionRequest: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            category: { type: 'string' },
            difficulty: { $ref: '#/components/schemas/DifficultyLevel' },
            visibility: { $ref: '#/components/schemas/VisibilityType' },
            tags: { type: 'array', items: { type: 'string' } },
            points: { type: 'integer' },
            estimatedTime: { type: 'integer' },
            negativeMarks: { type: 'integer' },
            explanation: { type: 'string' },
            authorNotes: { type: 'string' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } }
          }
        }
      }
    },
    tags: [
      {
        name: 'Questions',
        description: 'Question management endpoints'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);