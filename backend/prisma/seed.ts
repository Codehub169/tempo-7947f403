import { PrismaClient, UserRole, LeadStatus, LeadSource, AccountType, Industry, OpportunityStage, TaskPriority, TaskStatus, ActivityType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // --- Create Users ---
  const adminPassword = await bcrypt.hash('AdminPa$$wOrd', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@clientflow.com' },
    update: {},
    create: {
      email: 'admin@clientflow.com',
      name: 'Admin User',
      password: adminPassword,
      role: UserRole.ADMINISTRATOR,
      isActive: true,
    },
  });
  console.log(`Created admin user: ${adminUser.email}`);

  const managerPassword = await bcrypt.hash('ManagerPa$$wOrd', 10);
  const salesManagerUser = await prisma.user.upsert({
    where: { email: 'manager@clientflow.com' },
    update: {},
    create: {
      email: 'manager@clientflow.com',
      name: 'Sales Manager Sarah',
      password: managerPassword,
      role: UserRole.SALES_MANAGER,
      isActive: true,
    },
  });
  console.log(`Created sales manager user: ${salesManagerUser.email}`);

  const repPassword = await bcrypt.hash('RepPa$$wOrd', 10);
  const salesRepUser = await prisma.user.upsert({
    where: { email: 'rep@clientflow.com' },
    update: {},
    create: {
      email: 'rep@clientflow.com',
      name: 'Sales Rep John',
      password: repPassword,
      role: UserRole.SALES_REPRESENTATIVE,
      isActive: true,
    },
  });
  console.log(`Created sales rep user: ${salesRepUser.email}`);

  // --- Create Accounts ---
  const acc1 = await prisma.account.create({
    data: {
      accountName: 'Tech Solutions Inc.',
      industry: Industry.TECHNOLOGY,
      type: AccountType.CUSTOMER,
      website: 'https://techsolutions.example.com',
      phone: '555-0101',
      annualRevenue: 5000000,
      numberOfEmployees: 150,
      billingStreet: '123 Tech Road',
      billingCity: 'Innovateville',
      billingState: 'CA',
      billingPostalCode: '90210',
      billingCountry: 'USA',
      accountOwnerId: salesManagerUser.id,
    },
  });
  console.log(`Created account: ${acc1.accountName}`);

  const acc2 = await prisma.account.create({
    data: {
      accountName: 'Global Pharma Ltd.',
      industry: Industry.HEALTHCARE,
      type: AccountType.PROSPECT,
      website: 'https://globalpharma.example.com',
      phone: '555-0202',
      annualRevenue: 12000000,
      numberOfEmployees: 300,
      billingStreet: '456 Health Ave',
      billingCity: 'Wellspring',
      billingState: 'NY',
      billingPostalCode: '10001',
      billingCountry: 'USA',
      accountOwnerId: salesRepUser.id,
    },
  });
  console.log(`Created account: ${acc2.accountName}`);

  // --- Create Contacts ---
  const con1 = await prisma.contact.create({
    data: {
      firstName: 'Alice',
      lastName: 'Wonder',
      email: 'alice.wonder@techsolutions.example.com',
      phone: '555-0102',
      jobTitle: 'CTO',
      accountId: acc1.id,
      contactOwnerId: salesManagerUser.id,
    },
  });
  console.log(`Created contact: ${con1.email}`);

  const con2 = await prisma.contact.create({
    data: {
      firstName: 'Bob',
      lastName: 'Builder',
      email: 'bob.builder@globalpharma.example.com',
      phone: '555-0203',
      jobTitle: 'Procurement Head',
      accountId: acc2.id,
      contactOwnerId: salesRepUser.id,
    },
  });
  console.log(`Created contact: ${con2.email}`);

  // --- Create Leads ---
  const lead1 = await prisma.lead.create({
    data: {
      firstName: 'Charlie',
      lastName: 'Brown',
      email: 'charlie.brown@example.com',
      company: 'Peanuts Corp',
      status: LeadStatus.NEW,
      source: LeadSource.WEBSITE,
      estimatedValue: 15000,
      leadOwnerId: salesRepUser.id,
      description: 'Interested in cloud services.',
    },
  });
  console.log(`Created lead: ${lead1.email}`);

  const lead2 = await prisma.lead.create({
    data: {
      firstName: 'Diana',
      lastName: 'Prince',
      email: 'diana.prince@example.com',
      company: 'Themyscira Exports',
      status: LeadStatus.CONTACTED,
      source: LeadSource.REFERRAL,
      estimatedValue: 75000,
      leadOwnerId: salesManagerUser.id,
      description: 'Referred by an existing client. High potential.',
    },
  });
  console.log(`Created lead: ${lead2.email}`);

  // --- Create Opportunities ---
  const opp1 = await prisma.opportunity.create({
    data: {
      opportunityName: 'Tech Solutions - Upsell Project',
      accountId: acc1.id,
      stage: OpportunityStage.PROPOSAL_PRICE_QUOTE,
      amount: 250000,
      closeDate: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 15), // 2 months from now
      probability: 60,
      ownerId: salesManagerUser.id,
      primaryContactId: con1.id,
      description: 'Upsell new AI module to existing customer Tech Solutions Inc.',
      leadSource: LeadSource.OTHER, // Existing customer
    },
  });
  console.log(`Created opportunity: ${opp1.opportunityName}`);

  const opp2 = await prisma.opportunity.create({
    data: {
      opportunityName: 'Global Pharma - New ERP System',
      accountId: acc2.id,
      stage: OpportunityStage.QUALIFICATION,
      amount: 800000,
      closeDate: new Date(new Date().getFullYear(), new Date().getMonth() + 4, 20), // 4 months from now
      probability: 25,
      ownerId: salesRepUser.id,
      primaryContactId: con2.id,
      description: 'Potential deal for a full ERP system implementation.',
      leadSource: LeadSource.COLD_CALL,
    },
  });
  console.log(`Created opportunity: ${opp2.opportunityName}`);

  // --- Create Tasks ---
  const task1 = await prisma.task.create({
    data: {
      title: 'Follow up with Charlie Brown',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // 1 week from now
      assignedToId: salesRepUser.id,
      relatedLeadId: lead1.id,
      description: 'Call Charlie to discuss cloud service needs.',
    },
  });
  console.log(`Created task: ${task1.title}`);

  const task2 = await prisma.task.create({
    data: {
      title: 'Prepare proposal for Tech Solutions Upsell',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 14)), // 2 weeks from now
      assignedToId: salesManagerUser.id,
      relatedOpportunityId: opp1.id,
      description: 'Draft and finalize the proposal document for the AI module.',
    },
  });
  console.log(`Created task: ${task2.title}`);

  // --- Create Activities ---
  await prisma.activity.create({
    data: {
      type: ActivityType.LEAD_CREATED,
      summary: `Lead ${lead1.firstName} ${lead1.lastName} created.`, 
      userId: adminUser.id, // System or admin user might log this
      leadId: lead1.id,
    },
  });

  await prisma.activity.create({
    data: {
      type: ActivityType.CALL,
      summary: 'Initial call with Diana Prince.',
      notes: 'Discussed general needs, very positive interaction. Scheduled follow-up meeting.',
      userId: salesManagerUser.id,
      leadId: lead2.id,
      date: new Date(new Date().setDate(new Date().getDate() - 1)), // Yesterday
    },
  });
  
  await prisma.activity.create({
    data: {
      type: ActivityType.OPPORTUNITY_UPDATED,
      summary: `Opportunity "${opp1.opportunityName}" moved to ${OpportunityStage.PROPOSAL_PRICE_QUOTE}.`,
      userId: salesManagerUser.id,
      opportunityId: opp1.id,
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
