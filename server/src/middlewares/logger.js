//MIDELWARE PYYNTÖ.. Pyynnön keskellä ja tekee login.
const requestLogger = (req, res, next) => {
  console.log(new Date().toLocaleString('fi-EN'), req.method, req.url);

  if (req.body) {
    console.log('body', req.body); //body tiedon console.loggausta esim sähköpostiosoite
  }
  next();
};

export default requestLogger;
