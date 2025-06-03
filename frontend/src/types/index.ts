import { IconType } from 'react-icons';
import type { NextPage } from 'next';
import type { UserRole } from '@/lib/authOptions'; // Import UserRole enum

// User related types
export interface BaseUser {
  id: string;
  name: string | null;
  email: string | null;
  avatarUrl?: string;
}

// Represents the user object as available after authentication, consistent with useAuth hook
export interface AuthenticatedUser extends BaseUser {
  role: UserRole; // Uses the UserRole enum from authOptions
}

// Generic API response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = any> { // data can be any, or specific type T
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors?: { field: string; message: string }[];
  statusCode?: number;
}

// Core CRM Entity Types
export type EntityType = 'Lead' | 'Contact' | 'Account' | 'Opportunity' | 'Task' | 'User';

export interface BaseEntity {
  id: string;
  createdAt: string; // ISO Date string e.g., "2023-10-26T07:49:12.856Z"
  updatedAt: string; // ISO Date string
}

// Lead
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Converted' | 'Do Not Contact';
export type LeadSource = 'Web' | 'Referral' | 'Advertisement' | 'Cold Call' | 'Event' | 'Partner' | 'Other';

export interface Lead extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  status: LeadStatus;
  source?: LeadSource | null;
  leadOwnerId?: string | null; 
  leadOwner?: BaseUser | null; // Populated field
  estimatedValue?: number | null;
  description?: string | null;
}

// Contact
export interface Contact extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  mobilePhone?: string | null;
  accountId?: string | null;
  account?: Account | null; // Populated field
  jobTitle?: string | null;
  department?: string | null;
  linkedinProfile?: string | null;
  mailingStreet?: string | null;
  mailingCity?: string | null;
  mailingState?: string | null;
  mailingPostalCode?: string | null;
  mailingCountry?: string | null;
  description?: string | null;
  contactOwnerId?: string | null;
  contactOwner?: BaseUser | null; // Populated field
}

// Account
export type AccountType = 'Prospect' | 'Customer' | 'Partner' | 'Vendor' | 'Reseller' | 'Influencer' | 'Other';
export type Industry = 'IT Services' | 'Software Development' | 'Consulting' | 'Finance' | 'Healthcare' | 'Manufacturing' | 'Education' | 'Retail' | 'Other';

export interface Account extends BaseEntity {
  accountName: string;
  industry?: Industry | null;
  type?: AccountType | null;
  website?: string | null;
  phone?: string | null;
  annualRevenue?: number | null;
  numberOfEmployees?: number | null;
  billingStreet?: string | null;
  billingCity?: string | null;
  billingState?: string | null;
  billingPostalCode?: string | null;
  billingCountry?: string | null;
  shippingStreet?: string | null;
  shippingCity?: string | null;
  shippingState?: string | null;
  shippingPostalCode?: string | null;
  shippingCountry?: string | null;
  description?: string | null;
  accountOwnerId?: string | null;
  accountOwner?: BaseUser | null; // Populated field
  contacts?: Contact[]; // Populated list of related contacts
  opportunities?: Opportunity[]; // Populated list of related opportunities
}

// Opportunity
export type OpportunityStage = 
  | 'Prospecting' 
  | 'Qualification' 
  | 'Needs Analysis' 
  | 'Value Proposition' 
  | 'Proposal/Price Quote' 
  | 'Negotiation/Review' 
  | 'Closed Won' 
  | 'Closed Lost' 
  | 'On Hold';

export interface Opportunity extends BaseEntity {
  opportunityName: string;
  accountId: string;
  account?: Account | null; // Populated field
  stage: OpportunityStage;
  amount: number;
  closeDate: string; // ISO Date string
  probability?: number | null; // Percentage 0-100
  description?: string | null;
  leadSource?: LeadSource | null;
  ownerId?: string | null;
  owner?: BaseUser | null; // Populated field
}

// Task
export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Waiting on someone else' | 'Deferred';
export type TaskPriority = 'High' | 'Medium' | 'Low' | 'Urgent';

export interface Task extends BaseEntity {
  title: string;
  description?: string | null;
  dueDate?: string | null; // ISO Date string
  priority: TaskPriority;
  status: TaskStatus;
  assignedToId?: string | null;
  assignedTo?: BaseUser | null; // Populated field
  relatedToType?: EntityType | null;
  relatedToId?: string | null;
  relatedEntity?: Lead | Contact | Account | Opportunity | null; // Populated field based on type
}

// Activity
export type ActivityType = 
  | 'Call' 
  | 'Email' 
  | 'Meeting' 
  | 'Note' 
  | 'Task Created' 
  | 'Lead Created' 
  | 'Contact Created'
  | 'Account Created'
  | 'Opportunity Created'
  | 'Opportunity Stage Changed' 
  | 'Status Change' 
  | 'File Uploaded'
  | 'Other';

export interface Activity extends BaseEntity {
  type: ActivityType;
  summary: string;
  notes?: string | null;
  date: string; // ISO Date string, should be when the activity occurred
  userId: string; // ID of the user who performed/logged the activity
  user?: BaseUser | null; // Populated user object
  relatedToType?: EntityType | null;
  relatedToId?: string | null;
  relatedEntity?: Lead | Contact | Account | Opportunity | Task | null; // Populated field
}

// For UI Components, e.g. Table Columns
export interface ColumnDefinition<T extends BaseEntity> { // Ensure T has an id
  key: keyof T | string; 
  header: string;
  renderCell?: (row: T) => React.ReactNode;
  isNumeric?: boolean;
  sortable?: boolean;
  width?: string | number;
}

// For Navigation
export interface NavItem {
  label: string;
  href: string;
  icon?: IconType;
  children?: NavItem[];
  matchExact?: boolean;
  disabled?: boolean;
  roles?: UserRole[]; // Optional roles that can see this item
}

// Utility type for NextPage with layout (as used in _app.tsx)
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

// For Chakra UI color schemes
export type ChakraColorScheme = 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'cyan' | 'purple' | 'pink' | 'crm-primary' | 'crm-accent';
