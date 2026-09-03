import express from 'express';
import servicesRouter from './routes/services.router.js';

const app = express();

app.use(express.json());
app.use('/api/services', servicesRouter);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API de servicios funcionando',
  });
});

export default app;
