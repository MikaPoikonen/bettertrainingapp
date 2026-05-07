import { validationResult } from "express-validator";
// Middleware, joka tarkistaa express-validatorin tuottamat validointivirheet ja käsittelee ne. Jos virheitä löytyy, 
// luodaan uusi Error-objekti, joka sisältää virheilmoituksen ja virheiden listan, ja siirretään se seuraavaan middlewareen. 
// Jos virheitä ei löydy, jatketaan normaalisti seuraavaan middlewareen.
const validationErrorHandler = (req, res, next) => {
  const errors = validationResult(req, { strictParams: ["body"] });
  if (!errors.isEmpty()) {
    const error = new Error("Bad Request");
    error.status = 400;
    error.errors = errors.array({ onlyFirstError: true }).map((error) => {
      return { field: error.path, message: error.msg };
    });
    return next(error);
  }
  next();
};

export default validationErrorHandler;
