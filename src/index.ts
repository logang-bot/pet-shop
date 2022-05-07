import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

import app from './server/app';
import connect from './server/database';

console.log(process.env.NODE_ENV);

const port: string = process.env.PORT as string;
connect();

// console.log(path.join(__dirname, '../public'));

// app.use(express.static(path.join(__dirname, '../public')));

const server = app.listen(port, () => {
  console.log(`Server on port ${port}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! Shutting down');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
