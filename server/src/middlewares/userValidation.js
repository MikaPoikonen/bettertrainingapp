import { body } from "express-validator";
// Middleware, joka tarkistaa käyttäjään liittyvät kentät (username, password, email, start_weight, birth_year) express-validatorin avulla.
// Jokaiselle kentälle määritellään omat validointisäännöt ja virheilmoitukset. Esimerkiksi username-kenttä tarkistetaan,
// että se on 3-25 merkkiä pitkä ja sisältää vain kirjaimia, numeroita ja alaviivoja. Password-kenttä tarkistetaan,
// että se on vähintään 8 merkkiä pitkä ja sisältää isoja ja pieniä kirjaimia sekä numeroita. Email-kenttä tarkistetaan,
// että se on validi sähköpostiosoite. Start_weight-kenttä tarkistetaan, että se on välillä 30-500 kg. Birth_year-kenttä tarkistetaan,
// että se on validi päivämäärä eikä ole tulevaisuudessa tai liian vanha (yli 120 vuotta). Jos validointi epäonnistuu, palautetaan virheilmoitus.
const userValidation = [
  // USERNAME
  body("username")
    .trim()
    .isLength({ min: 3, max: 25 })
    .withMessage("Käyttäjänimi 3-25 merkkiä")
    .matches(/^[a-zA-Z0-9_@]+$/)
    .withMessage("Vain kirjaimet, numerot ja _ sallittu"),

  // PASSWORD
  body("password")
    .trim()
    .isLength({ min: 8, max: 50 })
    .withMessage("Salasana vähintään 8 merkkiä")
    .matches(/[A-Z]/)
    .withMessage("Vähintään yksi iso kirjain")
    .matches(/[a-z]/)
    .withMessage("Vähintään yksi pieni kirjain")
    .matches(/[0-9]/)
    .withMessage("Vähintään yksi numero"),

  // EMAIL
  body("email")
    .trim()
    .isEmail()
    .withMessage("Virheellinen sähköposti")
    .normalizeEmail(),

  // START WEIGHT
  body("start_weight")
    .optional()
    .isFloat({ min: 30, max: 500 })
    .withMessage("Painon oltava välillä 30-500"),

  // BIRTH YEAR
  body("birth_year")
    .optional()
    .isISO8601()
    .withMessage("Päivämäärän pitää olla YYYY-MM-DD")
    .toDate()
    .custom((value) => {
      const today = new Date();

      if (value > today) {
        throw new Error("Ei voi olla tulevaisuudessa");
      }

      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 120);

      if (value < minDate) {
        throw new Error("Liian vanha päivämäärä");
      }

      return true;
    }),
];

// Middleware, joka tarkistaa käyttäjään liittyvät kentät päivitystä varten. Käytetään updateUserControllerissa.
const updateUserValidation = [
  body("username")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 3, max: 25 })
    .withMessage("Username 3-25 merkkiä")
    .matches(/^[a-zA-Z0-9_@]+$/)
    .withMessage("Vain kirjaimet, numerot ja _ sallittu"),

  body("password")
    .optional({ checkFalsy: true })
    .trim()
    .notEmpty()
    .withMessage("Salasana ei voi olla tyhjä")
    .isLength({ min: 8, max: 50 })
    .withMessage("Salasana vähintään 8 merkkiä")
    .matches(/[A-Z]/)
    .withMessage("Vähintään yksi iso kirjain")
    .matches(/[a-z]/)
    .withMessage("Vähintään yksi pieni kirjain")
    .matches(/[0-9]/)
    .withMessage("Vähintään yksi numero"),

  body("email")
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage("Virheellinen sähköposti")
    .normalizeEmail(),
];

export { userValidation, updateUserValidation };
