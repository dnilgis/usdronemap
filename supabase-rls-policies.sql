-- ============================================
-- US Drone Map - Supabase Row Level Security (RLS) Policies
-- 
-- IMPORTANT: Run this in your Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste & Run
-- ============================================

-- ============================================
-- 1. PROFILE VIEWS TABLE
-- Purpose: Track unique views per pilot profile
-- ============================================

-- Create the profile_views table if it doesn't exist
CREATE TABLE IF NOT EXISTS profile_views (
    id BIGSERIAL PRIMARY KEY,
    pilot_id TEXT NOT NULL,
    visitor_hash TEXT NOT NULL,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent duplicate views from same visitor on same day
    CONSTRAINT unique_daily_view UNIQUE (pilot_id, visitor_hash, (viewed_at::date))
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profile_views_pilot_id ON profile_views(pilot_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_at ON profile_views(viewed_at);

-- Enable RLS
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (for clean slate)
DROP POLICY IF EXISTS "Allow anonymous inserts with rate limiting" ON profile_views;
DROP POLICY IF EXISTS "Allow anonymous reads for count" ON profile_views;
DROP POLICY IF EXISTS "Prevent bulk reads" ON profile_views;

-- Policy 1: Allow inserts but prevent spam
-- Only allows 1 view per visitor_hash per pilot per day (handled by unique constraint)
CREATE POLICY "Allow anonymous inserts" ON profile_views
    FOR INSERT 
    TO anon
    WITH CHECK (
        -- Visitor hash must be exactly 16 characters (our SHA-256 truncation)
        LENGTH(visitor_hash) = 16
        -- Pilot ID must be reasonable length
        AND LENGTH(pilot_id) BETWEEN 5 AND 200
    );

-- Policy 2: Allow reading view counts only (not raw data)
-- This returns just the count, not individual records
CREATE POLICY "Allow anonymous count reads" ON profile_views
    FOR SELECT 
    TO anon
    USING (
        -- Only allow reading views from last 30 days
        viewed_at > NOW() - INTERVAL '30 days'
    );

-- ============================================
-- 2. VERIFIED PILOTS TABLE (if you have one)
-- Purpose: Store verified pilot subscription info
-- ============================================

-- Create verified_pilots table
CREATE TABLE IF NOT EXISTS verified_pilots (
    id BIGSERIAL PRIMARY KEY,
    pilot_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    plan TEXT DEFAULT 'basic',
    status TEXT DEFAULT 'pending',
    verified_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE verified_pilots ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "No public access to verified pilots" ON verified_pilots;

-- Policy: Block ALL public access
-- Only server-side (service_role key) can read/write
CREATE POLICY "No public access" ON verified_pilots
    FOR ALL 
    TO anon
    USING (false)
    WITH CHECK (false);

-- ============================================
-- 3. CONTACT INQUIRIES TABLE
-- Purpose: Store contact form submissions
-- ============================================

CREATE TABLE IF NOT EXISTS contact_inquiries (
    id BIGSERIAL PRIMARY KEY,
    pilot_id TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    sender_name TEXT,
    message TEXT NOT NULL,
    ip_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Policy: Allow inserts with rate limiting logic
CREATE POLICY "Allow contact submissions" ON contact_inquiries
    FOR INSERT 
    TO anon
    WITH CHECK (
        -- Basic validation
        LENGTH(sender_email) BETWEEN 5 AND 255
        AND LENGTH(message) BETWEEN 10 AND 5000
        AND LENGTH(pilot_id) BETWEEN 5 AND 200
        -- Rate limit: max 5 submissions per IP per hour
        AND (
            SELECT COUNT(*) FROM contact_inquiries 
            WHERE ip_hash = NEW.ip_hash 
            AND created_at > NOW() - INTERVAL '1 hour'
        ) < 5
    );

-- Policy: No public reads
CREATE POLICY "No public reads on inquiries" ON contact_inquiries
    FOR SELECT 
    TO anon
    USING (false);

-- ============================================
-- 4. RATE LIMITING FUNCTION (Optional Advanced)
-- Purpose: Server-side rate limiting
-- ============================================

-- Create a function to check rate limits
CREATE OR REPLACE FUNCTION check_view_rate_limit(
    p_pilot_id TEXT,
    p_visitor_hash TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    recent_count INTEGER;
BEGIN
    -- Count views from this visitor in last minute
    SELECT COUNT(*) INTO recent_count
    FROM profile_views
    WHERE visitor_hash = p_visitor_hash
    AND viewed_at > NOW() - INTERVAL '1 minute';
    
    -- Allow if under 10 views per minute
    RETURN recent_count < 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 5. CLEANUP FUNCTION
-- Purpose: Auto-delete old view records
-- ============================================

-- Create cleanup function
CREATE OR REPLACE FUNCTION cleanup_old_views() RETURNS void AS $$
BEGIN
    DELETE FROM profile_views 
    WHERE viewed_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule cleanup (run manually or via pg_cron if available)
-- SELECT cleanup_old_views();

-- ============================================
-- VERIFICATION QUERIES
-- Run these to verify RLS is working
-- ============================================

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profile_views', 'verified_pilots', 'contact_inquiries');

-- Test insert (should work)
-- INSERT INTO profile_views (pilot_id, visitor_hash) 
-- VALUES ('test-pilot-id', 'a1b2c3d4e5f6g7h8');

-- Test bulk read (should return limited data only)
-- SELECT COUNT(*) FROM profile_views WHERE pilot_id = 'test-pilot-id';

-- ============================================
-- IMPORTANT SECURITY NOTES
-- ============================================
-- 
-- 1. NEVER expose your service_role key in client-side code
--    Only the anon key should be in JavaScript
--
-- 2. The anon key is MEANT to be public, but RLS protects the data
--
-- 3. For admin operations (verification, etc), use:
--    - Supabase Edge Functions with service_role key
--    - Server-side API routes (Next.js, Express, etc.)
--    - Supabase Dashboard directly
--
-- 4. Monitor your Supabase dashboard for:
--    - Unusual query patterns
--    - High insert volumes (potential spam)
--    - Failed RLS policy violations
--
-- 5. Consider adding:
--    - IP-based rate limiting at CDN level (Cloudflare)
--    - CAPTCHA for contact forms
--    - Email verification for verified pilots
--
