import { Router } from 'express';
// import * as activityController from '@/controllers/activity.controller'; // To be implemented
// import { authenticateToken } from '@/middlewares/auth.middleware'; // To be implemented
// import { validateLogActivity } from '@/middlewares/validation.middleware'; // To be implemented

const router = Router();

const activityControllerPlaceholder = {
  logActivity: async (req: any, res: any) => {
    // #swagger.tags = ['Activities']
    // #swagger.summary = 'Log a new activity'
    // #swagger.description = 'Logs a new activity (e.g., call, email, meeting, note) related to a CRM entity (Lead, Contact, Account, Opportunity).'
    /* #swagger.security = [{ "bearerAuth": [] }] */
    /* #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            type: { type: "string", enum: ["Call", "Email", "Meeting", "Note", "TaskCreated", "LeadCreated", "OpportunityUpdated"], example: "Call" },
                            summary: { type: "string", example: "Discussed Q4 targets" },
                            notes: { type: "string", example: "Client is interested in product X. Send follow-up email." },
                            date: { type: "string", format: "date-time", example: "2024-10-15T14:30:00Z" },
                            relatedToId: { type: "string", example: "contact-uuid-789" },
                            relatedToType: { type: "string", enum: ["Lead", "Contact", "Account", "Opportunity"], example: "Contact" },
                            userId: { type: "string", example: "user-uuid-123", description: "ID of the user performing the activity, often inferred from token." }
                        },
                        required: ["type", "summary", "date", "relatedToId", "relatedToType"]
                    }
                }
            }
        } */
    /* #swagger.responses[201] = {
            description: 'Activity logged successfully.',
            content: {
                "application/json": {
                    schema: { $ref: '#/components/schemas/Activity' }
                }
            }
        } */
    /* #swagger.responses[400] = { description: 'Invalid input.' } */
    /* #swagger.responses[401] = { description: 'Unauthorized.' } */
    /* #swagger.responses[404] = { description: 'Related entity not found.' } */
    res.status(201).json({ message: 'Placeholder: Activity logged successfully', data: req.body });
  },
  getActivitiesForEntity: async (req: any, res: any) => {
    // #swagger.tags = ['Activities']
    // #swagger.summary = 'Get activities for a specific entity'
    // #swagger.description = 'Retrieves all activities associated with a specific Lead, Contact, Account, or Opportunity.'
    /* #swagger.security = [{ "bearerAuth": [] }] */
    /* #swagger.parameters['entityType'] = { 
        in: 'path', 
        required: true, 
        description: 'Type of the entity (e.g., leads, contacts, accounts, opportunities)', 
        schema: { type: 'string', enum: ['leads', 'contacts', 'accounts', 'opportunities'] } 
    } */
    /* #swagger.parameters['entityId'] = { 
        in: 'path', 
        required: true, 
        description: 'ID of the entity', 
        schema: { type: 'string' } 
    } */
    /* #swagger.parameters['page'] = { in: 'query', description: 'Page number', schema: { type: 'integer', default: 1 } } */
    /* #swagger.parameters['limit'] = { in: 'query', description: 'Activities per page', schema: { type: 'integer', default: 10 } } */
    /* #swagger.responses[200] = {
            description: 'A list of activities for the entity.',
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            activities: { type: 'array', items: { $ref: '#/components/schemas/Activity' } },
                            totalPages: { type: 'integer' },
                            currentPage: { type: 'integer' }
                        }
                    }
                }
            }
        } */
    /* #swagger.responses[401] = { description: 'Unauthorized.' } */
    /* #swagger.responses[404] = { description: 'Entity not found.' } */
    res.status(200).json({ 
        message: `Placeholder: Fetched activities for ${req.params.entityType} with ID ${req.params.entityId}`,
        data: [], 
        totalPages: 1, 
        currentPage: 1 
    });
  },
};

// Apply authentication middleware to all activity routes
// router.use(authenticateToken);

router.post(
  '/',
  // validateLogActivity, // To be implemented
  activityControllerPlaceholder.logActivity
);

// Example route structure: /api/v1/activities/contacts/:entityId
router.get(
  '/:entityType/:entityId',
  activityControllerPlaceholder.getActivitiesForEntity
);

export default router;
