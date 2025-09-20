-- V1__init.sql - Initial schema for Curas MVP

-- Enable pgcrypto for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Wards where assets are located
CREATE TABLE wards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users of the system (Nurses, NUMs)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('NURSE', 'NUM')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Medical assets/equipment
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_tag VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    ward_id UUID NOT NULL REFERENCES wards(id),
    critical BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(50) NOT NULL CHECK (status IN ('AVAILABLE', 'FAULTED', 'OOS')),
    qr_code TEXT, -- Can store base64 or a URL to the QR code
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_assets_ward_id ON assets(ward_id);
CREATE INDEX idx_assets_status ON assets(status);

-- Templates for checklists
CREATE TABLE checklist_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Association table for templates and wards (many-to-many)
CREATE TABLE checklist_template_wards (
    template_id UUID NOT NULL REFERENCES checklist_templates(id) ON DELETE CASCADE,
    ward_id UUID NOT NULL REFERENCES wards(id) ON DELETE CASCADE,
    PRIMARY KEY (template_id, ward_id)
);

-- Individual items within a checklist template
CREATE TABLE checklist_template_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES checklist_templates(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    help_text TEXT,
    required BOOLEAN NOT NULL DEFAULT true,
    item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('YNN')), -- Yes/No/NA
    media_url VARCHAR(2048),
    item_order INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(template_id, item_order)
);

-- Instances of a checklist being performed
CREATE TABLE checklist_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES checklist_templates(id),
    ward_id UUID NOT NULL REFERENCES wards(id),
    opened_by_user_id UUID NOT NULL REFERENCES users(id),
    opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    submitted_by_user_id UUID REFERENCES users(id),
    submitted_at TIMESTAMPTZ,
    status VARCHAR(50) NOT NULL CHECK (status IN ('OPEN', 'SUBMITTED', 'ABANDONED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_checklist_instances_status ON checklist_instances(status);
CREATE INDEX idx_checklist_instances_ward_id_submitted_at ON checklist_instances(ward_id, submitted_at DESC);

-- Responses to individual items in a checklist instance
CREATE TABLE checklist_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id UUID NOT NULL REFERENCES checklist_instances(id) ON DELETE CASCADE,
    template_item_id UUID NOT NULL REFERENCES checklist_template_items(id),
    value VARCHAR(10) CHECK (value IN ('YES', 'NO', 'NA')),
    note TEXT,
    photo_url VARCHAR(2048),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(instance_id, template_item_id)
);

-- Issues or faults reported against an asset
CREATE TABLE issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(id),
    reported_by_user_id UUID NOT NULL REFERENCES users(id),
    reported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    symptom TEXT NOT NULL,
    photo_url VARCHAR(2048),
    status VARCHAR(50) NOT NULL CHECK (status IN ('OPEN', 'TRIAGED', 'IN_PROGRESS', 'RESOLVED')),
    triaged_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    resolution_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_severity ON issues(severity);
CREATE INDEX idx_issues_asset_id ON issues(asset_id);

-- Immutable log of all significant activities
CREATE TABLE activity_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actor_user_id UUID NOT NULL REFERENCES users(id),
    event_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    payload JSONB,
    request_id UUID
);
CREATE INDEX idx_activity_events_actor_user_id ON activity_events(actor_user_id);
CREATE INDEX idx_activity_events_entity_type_entity_id ON activity_events(entity_type, entity_id);

-- Records of file attachments stored in S3
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url VARCHAR(2048) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    checksum VARCHAR(255) NOT NULL,
    created_by_user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
