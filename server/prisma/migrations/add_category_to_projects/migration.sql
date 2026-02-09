-- Add category field to Project model
ALTER TABLE "Project" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'General';
