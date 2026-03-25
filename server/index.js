import express from 'express';
import userRouter from './src/routes/user-router.js';
import 'dotenv/config';


const hostname = '127.0.0.1';
const app = express();
const PORT = 3000;

// app.use((req, res, next) => {
//   console.log("BODY RAW TEST:", req.headers["content-type"]);
//   next();
// });



app.use(express.json());
app.use('/', express.static('public'));

//app.use(requestLogger);




// Api root
app.get('/api', (req, res) => {
  res.send('This is dummy items API!');
});

app.use('/api/users', userRouter)

app.listen(PORT,hostname, () => {
  console.log(`Server running on http://${hostname}:${PORT}/`);
});

app.use((err, req, res, next) => {
  console.error(err);

  const status = err.status || 500;

  res.status(status).json({
    error: {
      message: err.message || 'Internal Server Error',
      details: err.errors || null
    }
  });
});
