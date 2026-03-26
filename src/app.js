const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const studentsRouter = require('./routes/students');

const app = express();
app.use(express.json());

// Charger Swagger
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, '../swagger.json'), 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/students', studentsRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = app;
