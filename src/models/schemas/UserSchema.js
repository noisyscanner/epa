import {AccessTokenSchema} from './AccessTokenSchema';
import {Schema} from 'mongoose';
import {BaseSchema} from './BaseSchema';

const uniqueValidator = require('mongoose-unique-validator');

const validateEmployeeID = (employeeID) => true;

const validateEmail = (email) =>
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);

const validateCardNumber = (cardNumber) => true;

const validatePIN = (pin) => pin >= 1000 && pin <= 9999;

const validateMobileNumber = (number) => /07\d{9}/.test(number);

export const UserSchema = new Schema({
    employee_id: {
        type: String,
        unique: true,
        required: 'Employee ID is required',
        validate: [validateEmployeeID, 'Please enter a valid employee ID']
    },
    first_name: {
        type: String,
        required: 'First name is required',
        // TODO: Validation
    },
    surname: {
        type: String,
        required: 'Surname is required',
        // TODO: Validation
    },
    email: {
        type: String,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please enter a valid email address']
    },
    mobile_number: {
        type: String,
        unique: true,
        required: 'Mobile number is required',
        validate: [validateMobileNumber, 'Please enter a valid mobile number']
    },
    card_number: {
        type: String,
        unique: true,
        required: 'Card number is required',
        validate: [validateCardNumber, 'Please enter a valid card number']
    },
    pin: {
        type: Number,
        required: 'Please enter a 4 digit PIN number',
        validate: [validatePIN, 'PIN number must be a 4 digit number']
    },
    balance: {
        type: Number,
        default: 0
    },
    access_token: {
        type: AccessTokenSchema
    }
});

UserSchema.path('balance')
    .get((val) => {
        if (!val) return 0;
        return val / 100;
    })
    .set((val) => {
        const floatVal = parseFloat(val);
        if (!floatVal) return;
        return floatVal.toFixed(2) * 100;
    });

UserSchema.plugin(uniqueValidator, { message: "'{VALUE}' already exists" });

UserSchema.loadClass(BaseSchema);
