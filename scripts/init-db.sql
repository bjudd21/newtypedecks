-- Initialize the Gundam Card Game database
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions if they don't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create a dedicated user for the application (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'gundam_app') THEN
        CREATE ROLE gundam_app WITH LOGIN PASSWORD 'gundam_app_password';
    END IF;
END
$$;

-- Grant necessary permissions
GRANT CONNECT ON DATABASE gundam_card_game TO gundam_app;
GRANT USAGE ON SCHEMA public TO gundam_app;
GRANT CREATE ON SCHEMA public TO gundam_app;

-- Note: Tables will be created by Prisma migrations
-- This script just sets up the basic database structure
