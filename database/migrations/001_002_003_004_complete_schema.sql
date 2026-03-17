-- =============================================================================
-- CONTRACTOR SAAS DATABASE MIGRATIONS
-- =============================================================================
-- PostgreSQL Database Schema for Contractor Estimating & Scheduling SaaS
-- Version: 1.0.0
-- =============================================================================

-- This file contains all migration files for setting up the database schema.
-- Run migrations in order: 001 -> 002 -> 003 -> 004
-- =============================================================================

-- =============================================================================
-- MIGRATION 001: Extensions and Helper Functions
-- =============================================================================
-- Purpose: Enable required PostgreSQL extensions and create helper functions
-- =============================================================================

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable citext extension for case-insensitive email comparisons
CREATE EXTENSION IF NOT EXISTS "citext";

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function to generate a URL-friendly slug from business name
CREATE OR REPLACE FUNCTION generate_slug(text)
RETURNS TEXT AS $$
DECLARE
    input_text TEXT;
    slug TEXT;
BEGIN
    input_text := LOWER($1);
    -- Replace spaces and special characters with hyphens
    slug := regexp_replace(input_text, '[^a-z0-9]+', '-', 'g');
    -- Remove leading/trailing hyphens
    slug := trim(both '-' from slug);
    -- Limit to 50 characters
    slug := LEFT(slug, 50);
    RETURN slug;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to calculate trial end date (14 days from now)
CREATE OR REPLACE FUNCTION calculate_trial_end_date()
RETURNS TIMESTAMP WITH TIME ZONE AS $$
BEGIN
    RETURN NOW() + INTERVAL '14 days';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =============================================================================
-- MIGRATION 002: Core Tables
-- =============================================================================
-- Purpose: Create all core tables with proper relationships
-- =============================================================================

-- -----------------------------------------------------------------------------
-- TABLE: contractors
-- Purpose: Primary table for contractor accounts (tenants)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contractors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email CITEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    business_name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    phone TEXT NOT NULL,
    service_area TEXT,

    -- Onboarding & Subscription
    onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE,
    current_onboarding_step INTEGER NOT NULL DEFAULT 0,

    -- Trial & Subscription
    trial_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    trial_end_date TIMESTAMP WITH TIME ZONE DEFAULT calculate_trial_end_date(),
    subscription_status TEXT NOT NULL DEFAULT 'trialing'
        CHECK (subscription_status IN ('trialing', 'active', 'past_due', 'canceled', 'expired', 'incomplete')),

    -- Stripe Integration
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    current_period_end TIMESTAMP WITH TIME ZONE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add trigger for updated_at
CREATE TRIGGER update_contractors_timestamp
    BEFORE UPDATE ON contractors
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- -----------------------------------------------------------------------------
-- TABLE: service_categories
-- Purpose: Categories for organizing services (e.g., Plumbing, Electrical)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_custom BOOLEAN NOT NULL DEFAULT FALSE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Unique constraint per contractor
    UNIQUE (contractor_id, name)
);

-- Add trigger for updated_at
CREATE TRIGGER update_service_categories_timestamp
    BEFORE UPDATE ON service_categories
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- -----------------------------------------------------------------------------
-- TABLE: services
-- Purpose: Individual services offered by contractors
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    min_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    max_price NUMERIC(10, 2),
    fixed_price NUMERIC(10, 2),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_custom BOOLEAN NOT NULL DEFAULT FALSE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add trigger for updated_at
CREATE TRIGGER update_services_timestamp
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- -----------------------------------------------------------------------------
-- TABLE: estimates
-- Purpose: Customer estimate requests generated through widget
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS estimates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,

    -- Customer Information
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    customer_address TEXT,

    -- Selected Services (JSON array of service snapshots)
    selected_services JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Calculated Estimates
    estimate_min_total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    estimate_max_total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    estimate_fixed_total NUMERIC(10, 2),

    -- Job Details
    job_details TEXT,
    photo_urls JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Status
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'viewed', 'approved', 'declined', 'expired')),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add trigger for updated_at
CREATE TRIGGER update_estimates_timestamp
    BEFORE UPDATE ON estimates
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- -----------------------------------------------------------------------------
-- TABLE: appointments
-- Purpose: Scheduled appointments from customers
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    estimate_id UUID REFERENCES estimates(id) ON DELETE SET NULL,

    -- Customer Information
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,

    -- Scheduling
    requested_date DATE NOT NULL,
    requested_time TIME NOT NULL,
    scheduled_duration_minutes INTEGER,

    -- Status
    status TEXT NOT NULL DEFAULT 'requested'
        CHECK (status IN ('requested', 'confirmed', 'completed', 'declined', 'rescheduled', 'cancelled')),

    -- Notes
    notes TEXT,
    internal_notes TEXT,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add trigger for updated_at
CREATE TRIGGER update_appointments_timestamp
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- -----------------------------------------------------------------------------
-- TABLE: widget_settings
-- Purpose: Customization settings for contractor's widget
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS widget_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID NOT NULL UNIQUE REFERENCES contractors(id) ON DELETE CASCADE,

    -- Appearance
    theme TEXT NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
    accent_color TEXT NOT NULL DEFAULT '#2563EB',
    button_text TEXT NOT NULL DEFAULT 'Get Estimate',
    company_name TEXT,

    -- Display Options
    show_logo BOOLEAN NOT NULL DEFAULT TRUE,
    show_company_name BOOLEAN NOT NULL DEFAULT TRUE,

    -- Advanced
    custom_css TEXT,
    welcome_message TEXT,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add trigger for updated_at
CREATE TRIGGER update_widget_settings_timestamp
    BEFORE UPDATE ON widget_settings
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- =============================================================================
-- MIGRATION 003: Indexes
-- =============================================================================
-- Purpose: Create indexes for performance optimization
-- =============================================================================

-- Indexes for tenant isolation (critical for multi-tenant performance)
CREATE INDEX idx_service_categories_contractor_id
    ON service_categories(contractor_id);

CREATE INDEX idx_services_contractor_id
    ON services(contractor_id);

CREATE INDEX idx_estimates_contractor_id
    ON estimates(contractor_id);

CREATE INDEX idx_appointments_contractor_id
    ON appointments(contractor_id);

-- Indexes for foreign keys
CREATE INDEX idx_services_category_id
    ON services(category_id);

CREATE INDEX idx_appointments_estimate_id
    ON appointments(estimate_id);

-- Indexes for status queries
CREATE INDEX idx_estimates_status
    ON estimates(status);

CREATE INDEX idx_estimates_created_at
    ON estimates(created_at DESC);

CREATE INDEX idx_appointments_status
    ON appointments(status);

CREATE INDEX idx_appointments_requested_date
    ON appointments(requested_date);

CREATE INDEX idx_appointments_scheduled_time
    ON appointments(requested_date, requested_time);

-- Indexes for subscription queries
CREATE INDEX idx_contractors_subscription_status
    ON contractors(subscription_status);

CREATE INDEX idx_contractors_trial_end_date
    ON contractors(trial_end_date);

-- Composite index for calendar views
CREATE INDEX idx_appointments_contractor_date
    ON appointments(contractor_id, requested_date);

-- Full-text search index for service search
CREATE INDEX idx_services_name_search
    ON services USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- =============================================================================
-- MIGRATION 004: Seed Data and Backfill
-- =============================================================================
-- Purpose: Insert default data and backfill existing records
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Seed Data: Service Category Templates (Global templates)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS service_category_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default category templates
INSERT INTO service_category_templates (name, icon, description, sort_order) VALUES
    ('Handyman', 'Wrench', 'General repair and maintenance services', 1),
    ('Landscaping', 'Trees', 'Lawn care and garden services', 2),
    ('Cleaning', 'Sparkles', 'Residential and commercial cleaning', 3),
    ('Painting', 'Paintbrush', 'Interior and exterior painting', 4),
    ('Electrical', 'Zap', 'Electrical repairs and installations', 5),
    ('Plumbing', 'Droplets', 'Plumbing repairs and installations', 6),
    ('HVAC', 'Thermometer', 'Heating and cooling services', 7),
    ('Roofing', 'Home', 'Roof repair and replacement', 8)
ON CONFLICT DO NOTHING;

-- -----------------------------------------------------------------------------
-- Seed Data: Preloaded Service Templates
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS service_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_tag TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    default_min_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    default_max_price NUMERIC(10, 2),
    default_fixed_price NUMERIC(10, 2),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert preloaded services
INSERT INTO service_templates (category_tag, name, description, default_min_price, default_max_price) VALUES
    -- Handyman Services
    ('handyman', 'Furniture Assembly', 'Assemble or disassemble furniture', 50, 150),
    ('handyman', 'TV Mounting', 'Wall mount TV installation', 75, 200),
    ('handyman', 'Door Repair', 'Fix doors that won''t close properly', 60, 175),
    ('handyman', 'Light Fixture Install', 'Install or replace light fixtures', 80, 250),
    ('handyman', 'Minor Carpentry', 'Basic wood repairs and adjustments', 75, 200),
    ('handyman', 'Caulking', 'Seal gaps and cracks', 50, 150),
    ('handyman', 'General Repairs', 'Miscellaneous repair tasks', 60, 180),

    -- Landscaping Services
    ('landscaping', 'Lawn Mowing', 'Regular lawn mowing service', 35, 75),
    ('landscaping', 'Tree Trimming', 'Trim trees and shrubs', 100, 300),
    ('landscaping', 'Leaf Removal', 'Clean up fallen leaves', 50, 150),
    ('landscaping', 'Garden Bed Maintenance', 'Maintain garden beds', 75, 200),
    ('landscaping', 'Sprinkler Repair', 'Fix irrigation systems', 80, 250),
    ('landscaping', 'Sod Installation', 'Install new sod', 200, 500),
    ('landscaping', 'Mulching', 'Apply fresh mulch', 75, 200),

    -- Cleaning Services
    ('cleaning', 'Standard Cleaning', 'Regular house cleaning', 80, 150),
    ('cleaning', 'Deep Cleaning', 'Thorough deep cleaning', 150, 300),
    ('cleaning', 'Move In/Out Cleaning', 'Cleaning for moving', 175, 350),
    ('cleaning', 'Office Cleaning', 'Commercial office cleaning', 100, 250),
    ('cleaning', 'Carpet Cleaning', 'Professional carpet cleaning', 100, 200),
    ('cleaning', 'Window Cleaning', 'Clean interior/exterior windows', 75, 175),
    ('cleaning', 'Upholstery Cleaning', 'Clean furniture upholstery', 80, 200),

    -- Painting Services
    ('painting', 'Interior Painting', 'Paint interior walls', 200, 500),
    ('painting', 'Exterior Painting', 'Paint exterior surfaces', 300, 800),
    ('painting', 'Cabinet Painting', 'Refinish cabinets', 250, 600),
    ('painting', 'Deck Staining', 'Stain and seal decks', 200, 500),
    ('painting', 'Trim Painting', 'Paint doors, windows, trim', 100, 300),
    ('painting', 'Wallpaper Removal', 'Remove old wallpaper', 75, 200),
    ('painting', 'Popcorn Ceiling Removal', 'Remove textured ceilings', 150, 400),

    -- Electrical Services
    ('electrical', 'Outlet Installation', 'Install new electrical outlets', 75, 175),
    ('electrical', 'Light Switch Replacement', 'Replace switches', 50, 125),
    ('electrical', 'Ceiling Fan Install', 'Install ceiling fans', 150, 300),
    ('electrical', 'Electrical Panel Upgrade', 'Upgrade breaker panel', 500, 1500),
    ('electrical', 'Wiring Repair', 'Fix electrical wiring', 100, 300),
    ('electrical', 'Smoke Detector Install', 'Install smoke/CO detectors', 50, 100),
    ('electrical', 'Outdoor Lighting', 'Install outdoor lights', 100, 300),

    -- Plumbing Services
    ('plumbing', 'Leak Repair', 'Fix leaking pipes', 75, 200),
    ('plumbing', 'Toilet Repair', 'Fix running or clogged toilets', 75, 175),
    ('plumbing', 'Faucet Installation', 'Install or replace faucets', 75, 175),
    ('plumbing', 'Water Heater Install', 'Install water heater', 400, 1000),
    ('plumbing', 'Drain Cleaning', 'Clear clogged drains', 75, 200),
    ('plumbing', 'Garbage Disposal', 'Install or repair disposal', 100, 250),
    ('plumbing', 'Sump Pump Install', 'Install sump pump', 300, 600),

    -- HVAC Services
    ('hvac', 'AC Repair', 'Repair air conditioning', 100, 300),
    ('hvac', 'Heating Repair', 'Fix heating systems', 100, 300),
    ('hvac', 'AC Installation', 'Install new AC unit', 2000, 5000),
    ('hvac', 'Furnace Installation', 'Install new furnace', 2000, 5000),
    ('hvac', 'Duct Cleaning', 'Clean HVAC ducts', 150, 350),
    ('hvac', 'Thermostat Install', 'Install smart thermostat', 75, 175),
    ('hvac', 'Maintenance Tune-Up', 'Annual HVAC maintenance', 75, 150),

    -- Roofing Services
    ('roofing', 'Roof Inspection', 'Complete roof inspection', 0, 75),
    ('roofing', 'Shingle Repair', 'Repair damaged shingles', 100, 400),
    ('roofing', 'Roof Replacement', 'Full roof replacement', 3000, 10000),
    ('roofing', 'Gutter Cleaning', 'Clean gutters and downspouts', 75, 200),
    ('roofing', 'Gutter Installation', 'Install new gutters', 200, 600),
    ('roofing', 'Skylight Installation', 'Install roof skylight', 300, 800),
    ('roofing', 'Flashing Repair', 'Repair roof flashing', 75, 250)
ON CONFLICT DO NOTHING;

-- -----------------------------------------------------------------------------
-- Backfill: Create widget settings for existing contractors
-- -----------------------------------------------------------------------------
INSERT INTO widget_settings (contractor_id, company_name, accent_color, button_text)
SELECT id, business_name, '#2563EB', 'Get Estimate'
FROM contractors
WHERE NOT EXISTS (
    SELECT 1 FROM widget_settings WHERE widget_settings.contractor_id = contractors.id
);

-- -----------------------------------------------------------------------------
-- Backfill: Set trial dates for existing contractors if null
-- -----------------------------------------------------------------------------
UPDATE contractors
SET
    trial_start_date = COALESCE(trial_start_date, NOW()),
    trial_end_date = COALESCE(trial_end_date, calculate_trial_end_date()),
    subscription_status = COALESCE(subscription_status, 'trialing')
WHERE trial_start_date IS NULL OR trial_end_date IS NULL;

-- -----------------------------------------------------------------------------
-- Backfill: Set onboarding_complete for existing contractors
-- -----------------------------------------------------------------------------
UPDATE contractors
SET onboarding_complete = FALSE
WHERE onboarding_complete IS NULL;

-- =============================================================================
-- ROLLBACK INSTRUCTIONS
-- =============================================================================
-- To rollback these migrations, run the following commands in reverse order:
--
-- MIGRATION 004 (Data):
-- DROP TABLE IF EXISTS service_templates;
-- DROP TABLE IF EXISTS service_category_templates;
-- DELETE FROM widget_settings WHERE ...; -- Remove backfilled records
-- UPDATE contractors SET ...; -- Revert backfilled data
--
-- MIGRATION 003 (Indexes):
-- DROP INDEX IF EXISTS idx_appointments_contractor_date;
-- DROP INDEX IF EXISTS idx_contractors_trial_end_date;
-- DROP INDEX IF EXISTS idx_contractors_subscription_status;
-- ... (reverse all CREATE INDEX statements)
--
-- MIGRATION 002 (Tables):
-- DROP TRIGGER IF EXISTS update_appointments_timestamp ON appointments;
-- DROP TRIGGER IF EXISTS update_estimates_timestamp ON estimates;
-- DROP TRIGGER IF EXISTS update_services_timestamp ON services;
-- DROP TRIGGER IF EXISTS update_service_categories_timestamp ON service_categories;
-- DROP TRIGGER IF EXISTS update_widget_settings_timestamp ON widget_settings;
-- DROP TRIGGER IF EXISTS update_contractors_timestamp ON contractors;
-- DROP TABLE IF EXISTS appointments;
-- DROP TABLE IF EXISTS estimates;
-- DROP TABLE IF EXISTS services;
-- DROP TABLE IF EXISTS service_categories;
-- DROP TABLE IF EXISTS widget_settings;
-- DROP TABLE IF EXISTS contractors;
--
-- MIGRATION 001 (Extensions):
-- DROP FUNCTION IF EXISTS calculate_trial_end_date();
-- DROP FUNCTION IF EXISTS generate_slug(text);
-- DROP FUNCTION IF EXISTS update_updated_at_column();
-- DROP EXTENSION IF EXISTS "citext";
-- DROP EXTENSION IF EXISTS "uuid-ossp";
-- =============================================================================

-- =============================================================================
-- END OF MIGRATIONS
-- =============================================================================
