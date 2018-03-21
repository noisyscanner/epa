export const generateToken = (length = 32, alphabet = 'abcdef1234567890') =>
    [...new Array(length)]
        .map(() => alphabet.charAt(Math.floor(Math.random() * alphabet.length)))
        .join('');
