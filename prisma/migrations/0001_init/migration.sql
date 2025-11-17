-- Migration: 0001_init
-- Generated from prisma/schema.prisma

-- Create enums
CREATE TYPE "QuestionType" AS ENUM ('MCQ', 'PROGRAMMING', 'DESCRIPTIVE', 'IMAGE_BASED');
CREATE TYPE "DifficultyLevel" AS ENUM ('EASY', 'MEDIUM', 'HARD');
CREATE TYPE "VisibilityType" AS ENUM ('PUBLIC', 'PRIVATE');

-- Create Question table
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
