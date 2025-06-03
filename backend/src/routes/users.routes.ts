import { Router, Request, Response, NextFunction } from 'express';
// import * as userController from '../controllers/user.controller'; // TODO: Implement and uncomment
// import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware'; // TODO: Implement and uncomment
// import { validateCreateUser, validateUpdateUser, validateUpdateProfile } from '../middlewares/validation/user.validation'; // TODO: Implement and uncomment
// import { UserRole } from '../config/constants'; // TODO: Define and uncomment (e.g., in src/config/constants.ts or directly from Prisma types if suitable)

const router = Router();

// Placeholder for UserRole enum - replace with actual import
enum UserRolePlaceholder {
  ADMINISTRATOR = 'ADMINISTRATOR',
  SALES_MANAGER = 'SALES_MANAGER',
  SALES_REPRESENTATIVE = 'SALES_REPRESENTATIVE',
}

// Placeholder controller functions - replace with actual controller imports and logic
const userControllerPlaceholder = {
  getAllUsers: async (_req: Request, res: Response, _next: NextFunction) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Retrieves a list of all users.'
    // #swagger.description = 'Accessible only by administrators. Supports pagination (TODO).'
    // #swagger.security = [{ "BearerAuth": [] }]
    // #swagger.responses[200] = { description: 'List of users retrieved successfully.', schema: [{ $id: 'clx...', $email: 'user@example.com', $name: 'John Doe', $role: 'SALES_REPRESENTATIVE' }] }
    // #swagger.responses[401] = { description: 'Unauthorized.' }
    // #swagger.responses[403] = { description: 'Forbidden - Insufficient privileges.' }
    return res.status(200).json({ message: 'Get all users placeholder - Implement actual logic.' });
  },
  getUserById: async (req: Request, res: Response, _next: NextFunction) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Retrieves a specific user by their ID.'
    // #swagger.description = 'Accessible by administrators or the user themselves.'
    // #swagger.security = [{ "BearerAuth": [] }]
    // #swagger.parameters['id'] = { in: 'path', description: 'User ID (UUID format).', required: true, type: 'string', format: 'uuid' }
    // #swagger.responses[200] = { description: 'User details retrieved successfully.', schema: { $id: 'clx...', $email: 'user@example.com', $name: 'John Doe', $role: 'SALES_REPRESENTATIVE' } }
    // #swagger.responses[401] = { description: 'Unauthorized.' }
    // #swagger.responses[403] = { description: 'Forbidden - Insufficient privileges.' }
    // #swagger.responses[404] = { description: 'User not found.' }
    return res.status(200).json({ message: `Get user by ID placeholder: ${req.params.id} - Implement actual logic.` });
  },
  createUser: async (req: Request, res: Response, _next: NextFunction) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Creates a new user.'
    // #swagger.description = 'Typically accessible by administrators. For public registration, use /auth/register.'
    // #swagger.security = [{ "BearerAuth": [] }]
    // #swagger.parameters['body'] = { in: 'body', description: 'User details for creation.', required: true, schema: { $name: 'New User', $email: 'new@example.com', $password: 'securePassword123', $role: 'SALES_REPRESENTATIVE' } }
    // #swagger.responses[201] = { description: 'User created successfully.', schema: { $id: 'clx...', $email: 'new@example.com', $name: 'New User', $role: 'SALES_REPRESENTATIVE' } }
    // #swagger.responses[400] = { description: 'Invalid input data.' }
    // #swagger.responses[401] = { description: 'Unauthorized.' }
    // #swagger.responses[403] = { description: 'Forbidden - Insufficient privileges.' }
    // #swagger.responses[409] = { description: 'Conflict - User with this email already exists.' }
    return res.status(201).json({ message: 'Create user placeholder - Implement actual logic.', body: req.body });
  },
  updateUser: async (req: Request, res: Response, _next: NextFunction) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Updates an existing user by ID.'
    // #swagger.description = 'Accessible by administrators. Users can update their own profile via /users/profile.'
    // #swagger.security = [{ "BearerAuth": [] }]
    // #swagger.parameters['id'] = { in: 'path', description: 'User ID (UUID format).', required: true, type: 'string', format: 'uuid' }
    // #swagger.parameters['body'] = { in: 'body', description: 'User details to update.', required: true, schema: { $name: 'Updated Name', $role: 'SALES_MANAGER', $isActive: true } }
    // #swagger.responses[200] = { description: 'User updated successfully.', schema: { $id: 'clx...', $email: 'user@example.com', $name: 'Updated Name', $role: 'SALES_MANAGER' } }
    // #swagger.responses[400] = { description: 'Invalid input data.' }
    // #swagger.responses[401] = { description: 'Unauthorized.' }
    // #swagger.responses[403] = { description: 'Forbidden - Insufficient privileges.' }
    // #swagger.responses[404] = { description: 'User not found.' }
    return res.status(200).json({ message: `Update user placeholder: ${req.params.id} - Implement actual logic.`, body: req.body });
  },
  deleteUser: async (req: Request, res: Response, _next: NextFunction) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Deletes a user by ID.'
    // #swagger.description = 'Accessible only by administrators. Consider soft delete.'
    // #swagger.security = [{ "BearerAuth": [] }]
    // #swagger.parameters['id'] = { in: 'path', description: 'User ID (UUID format).', required: true, type: 'string', format: 'uuid' }
    // #swagger.responses[204] = { description: 'User deleted successfully (No Content).' }
    // #swagger.responses[401] = { description: 'Unauthorized.' }
    // #swagger.responses[403] = { description: 'Forbidden - Insufficient privileges.' }
    // #swagger.responses[404] = { description: 'User not found.' }
    return res.status(204).send(); // No content for successful deletion
  },
  getUserProfile: async (req: Request, res: Response, _next: NextFunction) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Retrieves the profile of the currently authenticated user.'
    // #swagger.description = 'Equivalent to /auth/me but under the /users scope.'
    // #swagger.security = [{ "BearerAuth": [] }]
    // #swagger.responses[200] = { description: 'User profile retrieved successfully.', schema: { $id: 'clx...', $email: 'user@example.com', $name: 'My Name', $role: 'SALES_REPRESENTATIVE', $phone: '123-456-7890' } }
    // #swagger.responses[401] = { description: 'Unauthorized.' }
    // @ts-ignore // req.user will be populated by authenticateToken middleware
    const user = req.user;
    return res.status(200).json({ message: 'Get current user profile placeholder - Implement actual logic.', user });
  },
  updateUserProfile: async (req: Request, res: Response, _next: NextFunction) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Updates the profile of the currently authenticated user.'
    // #swagger.description = 'Allows users to update their own information like name, phone, etc. Email/role changes might be restricted.'
    // #swagger.security = [{ "BearerAuth": [] }]
    // #swagger.parameters['body'] = { in: 'body', description: 'Profile details to update.', required: true, schema: { $name: 'My Updated Name', $phone: '098-765-4321' } }
    // #swagger.responses[200] = { description: 'User profile updated successfully.', schema: { $id: 'clx...', $email: 'user@example.com', $name: 'My Updated Name', $role: 'SALES_REPRESENTATIVE', $phone: '098-765-4321' } }
    // #swagger.responses[400] = { description: 'Invalid input data.' }
    // #swagger.responses[401] = { description: 'Unauthorized.' }
    return res.status(200).json({ message: 'Update current user profile placeholder - Implement actual logic.', body: req.body });
  },
};

// Apply authentication middleware to all user routes by default.
// Specific routes can then have further role-based authorization.
// router.use(authenticateToken); // TODO: Uncomment when auth.middleware is implemented

/**
 * @route   GET /api/v1/users
 * @desc    Get all users (Admin access)
 * @access  Private (Admin)
 */
router.get(
  '/',
  // authorizeRoles([UserRolePlaceholder.ADMINISTRATOR]), // TODO: Uncomment and use actual UserRole
  userControllerPlaceholder.getAllUsers
);

/**
 * @route   POST /api/v1/users
 * @desc    Create a new user (Admin access)
 * @access  Private (Admin)
 */
router.post(
  '/',
  // authorizeRoles([UserRolePlaceholder.ADMINISTRATOR]), // TODO: Uncomment and use actual UserRole
  // validateCreateUser, // TODO: Uncomment
  userControllerPlaceholder.createUser
);

/**
 * @route   GET /api/v1/users/profile
 * @desc    Get current authenticated user's profile
 * @access  Private (Authenticated users)
 */
router.get(
  '/profile', 
  // authenticateToken, // Already applied globally or ensure it's here if not global
  userControllerPlaceholder.getUserProfile
);

/**
 * @route   PATCH /api/v1/users/profile
 * @desc    Update current authenticated user's profile
 * @access  Private (Authenticated users)
 */
router.patch(
  '/profile',
  // authenticateToken, // Already applied globally or ensure it's here if not global
  // validateUpdateProfile, // TODO: Uncomment
  userControllerPlaceholder.updateUserProfile
);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get a specific user by ID (Admin or self access - controller should handle self-check)
 * @access  Private (Admin/Self)
 */
router.get(
  '/:id',
  // authorizeRoles([UserRolePlaceholder.ADMINISTRATOR /*, add logic for self */]), // TODO: Implement self-check or specific middleware
  userControllerPlaceholder.getUserById
);

/**
 * @route   PATCH /api/v1/users/:id
 * @desc    Update a user by ID (Admin access)
 * @access  Private (Admin)
 */
router.patch(
  '/:id',
  // authorizeRoles([UserRolePlaceholder.ADMINISTRATOR]), // TODO: Uncomment and use actual UserRole
  // validateUpdateUser, // TODO: Uncomment
  userControllerPlaceholder.updateUser
);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete a user by ID (Admin access)
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  // authorizeRoles([UserRolePlaceholder.ADMINISTRATOR]), // TODO: Uncomment and use actual UserRole
  userControllerPlaceholder.deleteUser
);

export default router;
