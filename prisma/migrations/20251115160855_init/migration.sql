-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MCQ', 'PROGRAMMING', 'DESCRIPTIVE', 'IMAGE_BASED');

-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "VisibilityType" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "category" TEXT NOT NULL,
    "difficulty" "DifficultyLevel" NOT NULL,
    "visibility" "VisibilityType" NOT NULL,
    "tags" TEXT[],
    "points" INTEGER NOT NULL,
    "estimatedTime" INTEGER NOT NULL,
    "negativeMarks" INTEGER DEFAULT 0,
    "explanation" TEXT,
    "authorNotes" TEXT,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);
