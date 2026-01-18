import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
  cors({
    origin: process.env.CORS,
    credentials: true,
  }),
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

import startRouter from '../src/routes/start.route.js';
import userRoute from '../src/routes/user.route.js';
import adminRoute from '../src/routes/admin.route.js';
import orderRoute from '../src/routes/order.route.js';
import paymentRoute from '../src/routes/payment.route.js';
app.use('/api/v1', startRouter);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/order', orderRoute);
app.use('/api/v1/payments', paymentRoute);

export default app;
