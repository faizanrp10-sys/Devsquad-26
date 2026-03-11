const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const tasksRouter = require('./routes/tasks');
const statsRouter = require('./routes/stats');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Body parser middleware
app.use(express.json());

// Load swagger file
try {
  const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  console.log('Swagger document not found or invalid');
}

// Mount routers
app.use('/api/tasks', tasksRouter);
app.use('/api/stats', statsRouter); 

app.get('/', (req, res) => {
    res.json({ message: "Welcome to Task Manager API. Visit /api-docs for documentation."});
});

// Error handling middleware
app.use(errorHandler);

const PORT = 3000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));