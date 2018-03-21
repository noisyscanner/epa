// Strips sensitive information from the user object
export const serialiseUser = ({
    first_name,
    surname,
    email,
    mobile_number,
    employee_id,
    balance
}) => ({
    first_name,
    surname,
    email,
    mobile_number,
    employee_id,
    balance
});
