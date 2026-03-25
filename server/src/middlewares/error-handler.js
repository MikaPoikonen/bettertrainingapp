import { validationResult } from "express-validator";

const validationErrorHandler = (req, res, next) => {
    const errors = validationResult(req, {strictParams: ['body']});
    if (!errors.isEmpty()) {
        const error = new Error('Bad Request');
        error.status = 400;
        error.errors = errors.array({onlyFirstError: true}).map((error) => {
            return {field: error.path, message: error.msg};
        });
        return next(error);
    }
    next();
};

export default validationErrorHandler;