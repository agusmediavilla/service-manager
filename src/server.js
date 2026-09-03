import http from 'http';
import { Server } from 'socket.io';

import app from './app.js';
import config from './config/env.config.js';
import { connectDatabase } from './config/db.config.js';

const startServer = async () => {
  await connectDatabase();

  const httpServer = http.createServer(app);
  const io = new Server(httpServer);

  app.set('io', io);

  io.on('connection', socket => {
    console.log(`Cliente conectado por Socket.io: ${socket.id}`);
  });

  httpServer.listen(config.port, () => {
    console.log(
      `Servidor ejecutándose en http://localhost:${config.port} - ${config.nodeEnv}`
    );
  });
};

startServer();
