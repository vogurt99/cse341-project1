const validator = require('validatorjs');

const saveContact = (req, res, next) => {
    const validationRule = {
        fName: 'required|string',
        lName: 'required|string',
        email: 'required|email',
        favColor: 'required|string',
        bday: 'string'
    };

    const validation = new validator(req.body, validationRule);

    if (validation.fails()) {
        res.status(412).send({
            success: false,
            message: 'Validation failed',
            data: validation.errors
        });
    } else {
        next();
    }
};

module.exports = {
    saveContact
};