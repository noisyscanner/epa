export class Validator {
    constructor(rules) {
        this.rules = rules;
    }

    validate(obj) {
        let errors = {};

        Object.entries(this.rules).forEach(([field, fieldRules]) => {
            if (fieldRules.when === false || typeof fieldRules.when === 'function' && !fieldRules.when()) {
                return;
            }

            const fieldValue = obj[field];
            let errs = [];

            // Do 'required' validation before the rest
            // If this fails, skip the rest of the rules
            if (fieldRules.required) {
                if (!fieldValue || fieldValue.length === 0) {
                    errs.push(`${field} is required`);
                }
            }

            if (errs.length === 0) {
                Object.entries(fieldRules).forEach(([ruleName, ruleValue]) => {
                    switch (ruleName) {
                        case 'oneOf':
                            if (!(ruleValue instanceof Array)) break;

                            if (!ruleValue.includes(fieldValue)) {
                                errs.push(`${field} must be one of: ${ruleValue.join(', ')}`)
                            }
                            break;
                        case 'type':
                            if(!Validator.validateType(fieldValue, ruleValue)) {
                                errs.push(`${field} must be a ${ruleValue.name}`);
                            }
                    }
                });
            }

            if (errs.length > 0) {
                errors[field] = errs;
            }
        });

        return (Object.keys(errors).length > 0) ? errors : undefined;
    }

    static validateType(value, type) {
        switch (type) {
            case Number:
                return !!parseFloat(value);
            default:
                return false;
        }
    }
}
