-- Create uuid-ossp extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Enum types
CREATE TYPE "UserRole" AS ENUM ('ADMINISTRATOR', 'SALES_MANAGER', 'SALES_REPRESENTATIVE');
CREATE TYPE "TokenType" AS ENUM ('ACCESS', 'REFRESH', 'RESET_PASSWORD', 'EMAIL_VERIFICATION');
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATION', 'CONVERTED', 'LOST');
CREATE TYPE "LeadSource" AS ENUM ('WEBSITE', 'REFERRAL', 'COLD_CALL', 'EMAIL_MARKETING', 'SOCIAL_MEDIA', 'TRADE_SHOW', 'OTHER');
CREATE TYPE "AccountType" AS ENUM ('PROSPECT', 'CUSTOMER', 'PARTNER', 'VENDOR', 'COMPETITOR', 'OTHER');
CREATE TYPE "Industry" AS ENUM ('TECHNOLOGY', 'FINANCE', 'HEALTHCARE', 'MANUFACTURING', 'RETAIL', 'EDUCATION', 'CONSULTING', 'OTHER');
CREATE TYPE "OpportunityStage" AS ENUM ('PROSPECTING', 'QUALIFICATION', 'NEEDS_ANALYSIS', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST');
CREATE TYPE "TaskPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'DEFERRED');
CREATE TYPE "ActivityType" AS ENUM ('CALL', 'EMAIL', 'MEETING', 'NOTE', 'TASK_CREATED', 'LEAD_CREATED', 'OPPORTUNITY_UPDATED', 'STATUS_CHANGED', 'OTHER');

-- Create function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create User table
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'SALES_REPRESENTATIVE',
    "avatar_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" TIMESTAMP(3) WITHOUT TIME ZONE,
    "created_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TRIGGER set_timestamp_user
BEFORE UPDATE ON "User"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Create Account table
CREATE TABLE "Account" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "account_name" TEXT NOT NULL,
    "industry" "Industry",
    "type" "AccountType",
    "website" TEXT,
    "phone" TEXT,
    "annual_revenue" DOUBLE PRECISION,
    "number_of_employees" INTEGER,
    "description" TEXT,
    "billing_street" TEXT,
    "billing_city" TEXT,
    "billing_state" TEXT,
    "billing_postal_code" TEXT,
    "billing_country" TEXT,
    "shipping_street" TEXT,
    "shipping_city" TEXT,
    "shipping_state" TEXT,
    "shipping_postal_code" TEXT,
    "shipping_country" TEXT,
    "account_owner_id" UUID,
    "created_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Account_account_owner_id_idx" ON "Account"("account_owner_id");
CREATE INDEX "Account_type_idx" ON "Account"("type");
CREATE INDEX "Account_industry_idx" ON "Account"("industry");
CREATE TRIGGER set_timestamp_account
BEFORE UPDATE ON "Account"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Create Contact table
CREATE TABLE "Contact" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "mobile_phone" TEXT,
    "job_title" TEXT,
    "department" TEXT,
    "linkedin_profile" TEXT,
    "description" TEXT,
    "mailing_street" TEXT,
    "mailing_city" TEXT,
    "mailing_state" TEXT,
    "mailing_postal_code" TEXT,
    "mailing_country" TEXT,
    "account_id" UUID,
    "contact_owner_id" UUID,
    "created_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Contact_account_id_idx" ON "Contact"("account_id");
CREATE INDEX "Contact_contact_owner_id_idx" ON "Contact"("contact_owner_id");
CREATE INDEX "Contact_email_idx" ON "Contact"("email");
CREATE TRIGGER set_timestamp_contact
BEFORE UPDATE ON "Contact"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Create Lead table
CREATE TABLE "Lead" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "source" "LeadSource",
    "estimated_value" DOUBLE PRECISION,
    "description" TEXT,
    "lead_owner_id" UUID,
    "is_converted" BOOLEAN NOT NULL DEFAULT false,
    "converted_at" TIMESTAMP(3) WITHOUT TIME ZONE,
    "converted_to_contact_id" UUID,
    "converted_to_account_id" UUID,
    "created_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Lead_lead_owner_id_idx" ON "Lead"("lead_owner_id");
CREATE INDEX "Lead_status_idx" ON "Lead"("status");
CREATE INDEX "Lead_source_idx" ON "Lead"("source");
CREATE INDEX "Lead_converted_to_contact_id_idx" ON "Lead"("converted_to_contact_id");
CREATE INDEX "Lead_converted_to_account_id_idx" ON "Lead"("converted_to_account_id");
CREATE TRIGGER set_timestamp_lead
BEFORE UPDATE ON "Lead"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Create Opportunity table
CREATE TABLE "Opportunity" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "opportunity_name" TEXT NOT NULL,
    "stage" "OpportunityStage" NOT NULL,
    "amount" DOUBLE PRECISION,
    "close_date" TIMESTAMP(3) WITHOUT TIME ZONE,
    "probability" DOUBLE PRECISION,
    "description" TEXT,
    "lead_source" "LeadSource",
    "account_id" UUID,
    "primary_contact_id" UUID,
    "owner_id" UUID,
    "created_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Opportunity_account_id_idx" ON "Opportunity"("account_id");
CREATE INDEX "Opportunity_primary_contact_id_idx" ON "Opportunity"("primary_contact_id");
CREATE INDEX "Opportunity_owner_id_idx" ON "Opportunity"("owner_id");
CREATE INDEX "Opportunity_stage_idx" ON "Opportunity"("stage");
CREATE TRIGGER set_timestamp_opportunity
BEFORE UPDATE ON "Opportunity"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Create Task table
CREATE TABLE "Task" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "due_date" TIMESTAMP(3) WITHOUT TIME ZONE,
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "assigned_to_id" UUID,
    "related_lead_id" UUID,
    "related_contact_id" UUID,
    "related_account_id" UUID,
    "related_opportunity_id" UUID,
    "created_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Task_assigned_to_id_idx" ON "Task"("assigned_to_id");
CREATE INDEX "Task_status_idx" ON "Task"("status");
CREATE INDEX "Task_priority_idx" ON "Task"("priority");
CREATE INDEX "Task_related_lead_id_idx" ON "Task"("related_lead_id");
CREATE INDEX "Task_related_contact_id_idx" ON "Task"("related_contact_id");
CREATE INDEX "Task_related_account_id_idx" ON "Task"("related_account_id");
CREATE INDEX "Task_related_opportunity_id_idx" ON "Task"("related_opportunity_id");
CREATE TRIGGER set_timestamp_task
BEFORE UPDATE ON "Task"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Create Activity table
CREATE TABLE "Activity" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "type" "ActivityType" NOT NULL,
    "summary" TEXT NOT NULL,
    "notes" TEXT,
    "date" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL, -- User who logged/performed the activity
    "related_lead_id" UUID,
    "related_contact_id" UUID,
    "related_account_id" UUID,
    "related_opportunity_id" UUID,
    "related_task_id" UUID,
    "created_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Activity_user_id_idx" ON "Activity"("user_id");
CREATE INDEX "Activity_type_idx" ON "Activity"("type");
CREATE INDEX "Activity_related_lead_id_idx" ON "Activity"("related_lead_id");
CREATE INDEX "Activity_related_contact_id_idx" ON "Activity"("related_contact_id");
CREATE INDEX "Activity_related_account_id_idx" ON "Activity"("related_account_id");
CREATE INDEX "Activity_related_opportunity_id_idx" ON "Activity"("related_opportunity_id");
CREATE INDEX "Activity_related_task_id_idx" ON "Activity"("related_task_id");
CREATE TRIGGER set_timestamp_activity
BEFORE UPDATE ON "Activity"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Create Token table
CREATE TABLE "Token" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "token" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "expires_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL,
    "blacklisted" BOOLEAN NOT NULL DEFAULT false,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Token_token_key" ON "Token"("token");
CREATE INDEX "Token_user_id_idx" ON "Token"("user_id");
CREATE TRIGGER set_timestamp_token
BEFORE UPDATE ON "Token"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Add foreign keys

ALTER TABLE "Account"
    ADD CONSTRAINT "Account_account_owner_id_fkey" FOREIGN KEY ("account_owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Contact"
    ADD CONSTRAINT "Contact_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    ADD CONSTRAINT "Contact_contact_owner_id_fkey" FOREIGN KEY ("contact_owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Lead"
    ADD CONSTRAINT "Lead_lead_owner_id_fkey" FOREIGN KEY ("lead_owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT "Lead_converted_to_contact_id_fkey" FOREIGN KEY ("converted_to_contact_id") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    ADD CONSTRAINT "Lead_converted_to_account_id_fkey" FOREIGN KEY ("converted_to_account_id") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Opportunity"
    ADD CONSTRAINT "Opportunity_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "Opportunity_primary_contact_id_fkey" FOREIGN KEY ("primary_contact_id") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    ADD CONSTRAINT "Opportunity_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Task"
    ADD CONSTRAINT "Task_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    ADD CONSTRAINT "Task_related_lead_id_fkey" FOREIGN KEY ("related_lead_id") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "Task_related_contact_id_fkey" FOREIGN KEY ("related_contact_id") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "Task_related_account_id_fkey" FOREIGN KEY ("related_account_id") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "Task_related_opportunity_id_fkey" FOREIGN KEY ("related_opportunity_id") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Activity"
    ADD CONSTRAINT "Activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "Activity_related_lead_id_fkey" FOREIGN KEY ("related_lead_id") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "Activity_related_contact_id_fkey" FOREIGN KEY ("related_contact_id") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "Activity_related_account_id_fkey" FOREIGN KEY ("related_account_id") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "Activity_related_opportunity_id_fkey" FOREIGN KEY ("related_opportunity_id") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "Activity_related_task_id_fkey" FOREIGN KEY ("related_task_id") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Token"
    ADD CONSTRAINT "Token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
