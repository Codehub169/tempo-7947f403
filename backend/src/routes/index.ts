import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './users.routes';
// Placeholder imports for other domain-specific routes
// import leadRoutes from './leads.routes';
// import contactRoutes from './contacts.routes';
// import accountRoutes from './accounts.routes';
// import opportunityRoutes from './opportunities.routes';
// import taskRoutes from './tasks.routes';
// import activityRoutes from './activities.routes';
// import reportRoutes from './reports.routes';

const router = Router();

// Base route for API v1 - can be used for a simple health check or API info
router.get('/', (_req, res) => {
  res.json({ 
    message: 'Welcome to ClientFlow CRM API v1',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Mount auth routes
router.use('/auth', authRoutes);

// Mount user routes
router.use('/users', userRoutes);

// Placeholder for mounting other domain-specific routes - uncomment as they are implemented
// router.use('/leads', leadRoutes);
// router.use('/contacts', contactRoutes);
// router.use('/accounts', accountRoutes);
// router.use('/opportunities', opportunityRoutes);
// router.use('/tasks', taskRoutes);
// router.use('/activities', activityRoutes);
// router.use('/reports', reportRoutes);

export default router;
