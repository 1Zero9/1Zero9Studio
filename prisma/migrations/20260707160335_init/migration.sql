-- CreateTable
CREATE TABLE "ProjectMedia" (
    "id" TEXT NOT NULL,
    "projectSlug" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectLink" (
    "id" TEXT NOT NULL,
    "projectSlug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "kind" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminLoginToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminLoginToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectMedia_projectSlug_idx" ON "ProjectMedia"("projectSlug");

-- CreateIndex
CREATE INDEX "ProjectLink_projectSlug_idx" ON "ProjectLink"("projectSlug");

-- CreateIndex
CREATE UNIQUE INDEX "AdminLoginToken_tokenHash_key" ON "AdminLoginToken"("tokenHash");
