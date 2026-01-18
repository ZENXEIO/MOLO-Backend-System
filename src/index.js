import dotenv from 'dotenv';
import connectToDB from './configs/db.config.js';
import app from '../src/app.js';

dotenv.config({
  path: './env',
});

connectToDB()
  .then(() => {
    app.listen(process.env.PORT || 6000, () => {
      console.log(`server running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log('MONGODB CONNECTION FAILED', err);
  });
