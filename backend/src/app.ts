import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import swaggerSpec from './config/swagger';

// Routes
import authRoutes from './routes/auth.routes';
import orgRoutes from './routes/organization.routes';
import propertyRoutes from './routes/property.routes';
import floorRoutes from './routes/floor.routes';
import roomRoutes from './routes/room.routes';
import bedRoutes from './routes/bed.routes';
import tenantRoutes from './routes/tenant.routes';
import assignmentRoutes from './routes/assignment.routes';
import rentRoutes from './routes/rent.routes';
import paymentRoutes from './routes/payment.routes';
import expenseRoutes from './routes/expense.routes';
import complaintRoutes from './routes/complaint.routes';
import dashboardRoutes from './routes/dashboard.routes';

const app = express();

// Security middleware
app.use(helmet());

// Enable CORS so frontend can call API
app.use(cors({ origin: config.cors.origin, credentials: true }));

// Parse JSON request bodies
app.use(express.json());

// Swagger API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Welcome route
app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to PGFlow API',
    version: '1.0.0',
    docs: '/api-docs',
  });
});

// Health check route
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'PGFlow API',
  });
});

// API Routes v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/organizations', orgRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/floors', floorRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/beds', bedRoutes);
app.use('/api/v1/tenants', tenantRoutes);
app.use('/api/v1/assignments', assignmentRoutes);
app.use('/api/v1/rents', rentRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/expenses', expenseRoutes);
app.use('/api/v1/complaints', complaintRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Centralized error handling
app.use(errorHandler);

export default app;
