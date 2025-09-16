-- Migration: Add performance indexes for scalability
-- This migration adds database indexes to improve query performance

-- User table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "User_email_idx" ON "User"("email");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "User_createdAt_idx" ON "User"("createdAt");

-- Account table indexes  
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Account_userId_idx" ON "Account"("userId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Account_provider_idx" ON "Account"("provider");

-- Session table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Session_expires_idx" ON "Session"("expires");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Session_sessionToken_idx" ON "Session"("sessionToken");

-- CV table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "CV_userId_idx" ON "CV"("userId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "CV_slug_idx" ON "CV"("slug");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "CV_isPublic_idx" ON "CV"("isPublic");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "CV_createdAt_idx" ON "CV"("createdAt");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "CV_updatedAt_idx" ON "CV"("updatedAt");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "CV_userId_isPublic_idx" ON "CV"("userId", "isPublic");

-- Partial indexes for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS "CV_public_recent_idx" ON "CV"("createdAt" DESC) WHERE "isPublic" = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Session_active_idx" ON "Session"("expires") WHERE "expires" > NOW();

-- JSON indexes for CV content search (PostgreSQL specific)
CREATE INDEX CONCURRENTLY IF NOT EXISTS "CV_content_gin_idx" ON "CV" USING GIN ("content");

-- Cleanup old expired sessions (can be run periodically)
-- DELETE FROM "Session" WHERE "expires" < NOW() - INTERVAL '7 days';
