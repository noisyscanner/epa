import uniqueValidator from 'mongoose-unique-validator';
import sha1 from 'sha1';
import {AccessTokenSchema} from './AccessTokenSchema';
import {Schema} from 'mongoose';
import {BaseSchema} from './BaseSchema';

export const UserSchema = new Schema({
    employee_id: {
        type: String,
        unique: true,
        required: 'Employee ID is required'
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
    },
    mobile_number: {
        type: String,
        unique: true,
        required: 'Mobile number is required'
    },
    card_number: {
        type: String,
        unique: true,
        required: 'Card number is required',
    },
    pin: {
        type: String,
        required: 'Please enter a 4 digit PIN number',
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
    .get((val) => val / 100)
    .set((val) => {
        const floatVal = parseFloat(val);
        if (!floatVal) return this.balance;
        return floatVal.toFixed(2) * 100;
    });

UserSchema.pre('save', function (next) {
    this.card_number = sha1(this.card_number);
    this.pin = sha1(this.pin);

    next();
});

UserSchema.plugin(uniqueValidator, { message: "'{VALUE}' already exists" });

UserSchema.loadClass(BaseSchema);
