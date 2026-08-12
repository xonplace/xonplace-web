-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "assessmentVersion" TEXT NOT NULL DEFAULT '1.0',
ADD COLUMN     "businessImpactScore" INTEGER,
ADD COLUMN     "confidenceScore" INTEGER,
ADD COLUMN     "intelligence" JSONB,
ADD COLUMN     "opportunityScore" INTEGER,
ADD COLUMN     "readinessScore" INTEGER,
ADD COLUMN     "scoringVersion" TEXT NOT NULL DEFAULT '1.0';

-- AlterTable
ALTER TABLE "Blueprint" ADD COLUMN     "scoringVersion" TEXT NOT NULL DEFAULT '1.0';

-- CreateIndex
CREATE INDEX "Assessment_clientId_idx" ON "Assessment"("clientId");

-- CreateIndex
CREATE INDEX "Assessment_status_idx" ON "Assessment"("status");

-- CreateIndex
CREATE INDEX "Assessment_createdAt_idx" ON "Assessment"("createdAt");

-- CreateIndex
CREATE INDEX "Assessment_scoringVersion_idx" ON "Assessment"("scoringVersion");

-- CreateIndex
CREATE INDEX "Assessment_readinessScore_idx" ON "Assessment"("readinessScore");

-- CreateIndex
CREATE INDEX "Assessment_opportunityScore_idx" ON "Assessment"("opportunityScore");

-- CreateIndex
CREATE INDEX "Assessment_businessImpactScore_idx" ON "Assessment"("businessImpactScore");

-- CreateIndex
CREATE INDEX "Assessment_confidenceScore_idx" ON "Assessment"("confidenceScore");

-- CreateIndex
CREATE INDEX "Blueprint_scoringVersion_idx" ON "Blueprint"("scoringVersion");

-- CreateIndex
CREATE INDEX "Blueprint_createdAt_idx" ON "Blueprint"("createdAt");

-- CreateIndex
CREATE INDEX "Client_name_idx" ON "Client"("name");

-- CreateIndex
CREATE INDEX "Client_industry_idx" ON "Client"("industry");
