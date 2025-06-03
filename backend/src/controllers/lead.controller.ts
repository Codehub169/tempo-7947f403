import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status-codes';
import { prismaClient } from '../config/db';
import ApiError from '../utils/ApiError';
import { logger } from '../config/logger';

// Assuming a Lead type/interface might be defined in a central types file
// For now, we'll infer from usage or use Prisma's generated types implicitly

/**
 * @desc Create a new lead
 * @route POST /api/v1/leads
 * @access Private (Sales Representative, Sales Manager, Administrator)
 */
export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone,
      company, 
      status, 
      source, 
      estimatedValue,
      description,
      leadOwnerId // This should be the ID of an existing user
    } = req.body;

    // Basic validation (more comprehensive validation should be in middleware)
    if (!firstName || !lastName || !email || !status || !leadOwnerId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Missing required fields: firstName, lastName, email, status, leadOwnerId');
    }

    // Check if lead owner exists
    const leadOwner = await prismaClient.user.findUnique({
      where: { id: leadOwnerId },
    });
    if (!leadOwner) {
      throw new ApiError(httpStatus.NOT_FOUND, `Lead owner with ID ${leadOwnerId} not found`);
    }

    const newLead = await prismaClient.lead.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        company,
        status,
        source,
        estimatedValue,
        description,
        leadOwnerId,
        // createdById: (req as any).user.id, // Assuming req.user is populated by auth middleware
      },
    });

    logger.info(`Lead created: ${newLead.id} by user ${(req as any).user?.id || 'unknown'}`);
    res.status(httpStatus.CREATED).json(newLead);
  } catch (error) {
    logger.error('Error creating lead:', error);
    next(error);
  }
};

/**
 * @desc Get all leads
 * @route GET /api/v1/leads
 * @access Private (Sales Representative, Sales Manager, Administrator)
 */
export const getAllLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', status, source, leadOwnerId } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const whereClause: any = {};
    if (status) whereClause.status = status as string;
    if (source) whereClause.source = source as string;
    if (leadOwnerId) whereClause.leadOwnerId = leadOwnerId as string;

    const leads = await prismaClient.lead.findMany({
      where: whereClause,
      skip,
      take: limitNum,
      orderBy: {
        [sortBy as string]: sortOrder as 'asc' | 'desc',
      },
      include: {
        leadOwner: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    const totalLeads = await prismaClient.lead.count({
      where: whereClause,
    });

    res.status(httpStatus.OK).json({
      data: leads,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalLeads / limitNum),
        totalItems: totalLeads,
        itemsPerPage: limitNum,
      },
    });
  } catch (error) {
    logger.error('Error fetching leads:', error);
    next(error);
  }
};

/**
 * @desc Get a single lead by ID
 * @route GET /api/v1/leads/:id
 * @access Private (Sales Representative, Sales Manager, Administrator)
 */
export const getLeadById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const lead = await prismaClient.lead.findUnique({
      where: { id },
      include: {
        leadOwner: {
          select: { id: true, name: true, email: true }
        },
        // activities: true, // Example: include related activities if model relationship exists
        // tasks: true, // Example: include related tasks if model relationship exists
      },
    });

    if (!lead) {
      throw new ApiError(httpStatus.NOT_FOUND, `Lead with ID ${id} not found`);
    }

    res.status(httpStatus.OK).json(lead);
  } catch (error) {
    logger.error(`Error fetching lead ${req.params.id}:`, error);
    next(error);
  }
};

/**
 * @desc Update a lead by ID
 * @route PATCH /api/v1/leads/:id
 * @access Private (Sales Representative, Sales Manager, Administrator)
 */
export const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Prevent updating certain fields if necessary, e.g., leadOwnerId without specific permission
    if (updateData.leadOwnerId) {
        const leadOwner = await prismaClient.user.findUnique({
            where: { id: updateData.leadOwnerId },
          });
          if (!leadOwner) {
            throw new ApiError(httpStatus.NOT_FOUND, `New lead owner with ID ${updateData.leadOwnerId} not found`);
          }
    }

    const lead = await prismaClient.lead.update({
      where: { id },
      data: updateData,
      include: {
        leadOwner: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    logger.info(`Lead updated: ${lead.id} by user ${(req as any).user?.id || 'unknown'}`);
    res.status(httpStatus.OK).json(lead);
  } catch (error) {
    // Handle Prisma's P2025 error for record not found during update
    if ((error as any).code === 'P2025') {
        logger.warn(`Attempted to update non-existent lead ${req.params.id}`);
        return next(new ApiError(httpStatus.NOT_FOUND, `Lead with ID ${req.params.id} not found`));
    }
    logger.error(`Error updating lead ${req.params.id}:`, error);
    next(error);
  }
};

/**
 * @desc Delete a lead by ID
 * @route DELETE /api/v1/leads/:id
 * @access Private (Sales Manager, Administrator)
 */
export const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prismaClient.lead.delete({
      where: { id },
    });
    
    logger.info(`Lead deleted: ${id} by user ${(req as any).user?.id || 'unknown'}`);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    // Handle Prisma's P2025 error for record not found during delete
    if ((error as any).code === 'P2025') {
        logger.warn(`Attempted to delete non-existent lead ${req.params.id}`);
        return next(new ApiError(httpStatus.NOT_FOUND, `Lead with ID ${req.params.id} not found`));
    }
    logger.error(`Error deleting lead ${req.params.id}:`, error);
    next(error);
  }
};
