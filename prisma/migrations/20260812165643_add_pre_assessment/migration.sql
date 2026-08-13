-- CreateTable
CREATE TABLE "PreAssessment" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "email" TEXT,
    "contactName" TEXT,
    "companyName" TEXT,
    "context" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PreAssessment_tokenHash_key" ON "PreAssessment"("tokenHash");

-- CreateIndex
CREATE INDEX "PreAssessment_email_idx" ON "PreAssessment"("email");

-- CreateIndex
CREATE INDEX "PreAssessment_status_idx" ON "PreAssessment"("status");

-- CreateIndex
CREATE INDEX "PreAssessment_expiresAt_idx" ON "PreAssessment"("expiresAt");

-- CreateIndex
CREATE INDEX "PreAssessment_createdAt_idx" ON "PreAssessment"("createdAt");
