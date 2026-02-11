-- RemoveSchema: Remove multilingual fields from Project and Service models

-- Drop multilingual columns from Project if they exist
ALTER TABLE "Project" DROP COLUMN IF EXISTS "titleAr";
ALTER TABLE "Project" DROP COLUMN IF EXISTS "descriptionAr";
ALTER TABLE "Project" DROP COLUMN IF EXISTS "fullDescriptionAr";
ALTER TABLE "Project" DROP COLUMN IF EXISTS "featuresAr";

-- Drop multilingual columns from Service if they exist
ALTER TABLE "Service" DROP COLUMN IF EXISTS "shortDescriptionAr";
ALTER TABLE "Service" DROP COLUMN IF EXISTS "fullContentAr";
ALTER TABLE "Service" DROP COLUMN IF EXISTS "featuresAr";
