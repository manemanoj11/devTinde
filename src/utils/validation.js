const validator = require('validator')

const validateSignUp = (req) => {

    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Name is not valid")
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Enter the valid Email")
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Enter the Strong password")
    }
}


const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "age"
    ]


    const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field)
    )
    return isEditAllowed

}



module.exports = {
    validateSignUp,
    validateEditProfileData
}