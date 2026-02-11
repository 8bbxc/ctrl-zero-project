-- AddColumn: add Arabic and features columns to Project model
ALTER TABLE "Project" ADD COLUMN "titleAr" TEXT;
ALTER TABLE "Project" ADD COLUMN "descriptionAr" TEXT;
ALTER TABLE "Project" ADD COLUMN "fullDescriptionAr" TEXT;
ALTER TABLE "Project" ADD COLUMN "features" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Project" ADD COLUMN "featuresAr" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AddColumn: add Arabic and features columns to Service model
ALTER TABLE "Service" ADD COLUMN "titleAr" TEXT;
ALTER TABLE "Service" ADD COLUMN "shortDescriptionAr" TEXT;
ALTER TABLE "Service" ADD COLUMN "fullContentAr" TEXT;
ALTER TABLE "Service" ADD COLUMN "features" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Service" ADD COLUMN "featuresAr" TEXT[] DEFAULT ARRAY[]::TEXT[];
