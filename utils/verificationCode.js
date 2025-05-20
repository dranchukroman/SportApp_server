const codes = new Map();

export function generateCode() {
    const code = Math.floor(Math.random() * 999999) + 1;
    return code.toString().padStart(6, '0');
}

export function storeCode(email, code) {
    const expiresAt = Date.now() + 10 * 60 * 1000;
    codes.set(email, { code, expiresAt });
}

export function getCodeData(email) {
    const data = codes.get(email);
    if (!data) return false;
    return data;
}

export function verifyCode(email, inputCode) {
    const data = codes.get(email);
    if (!data) return false;

    const { code, expiresAt } = data;

    if (Date.now() > expiresAt) {
        codes.delete(email);
        return false;
    }

    return Number(code) === Number(inputCode);
}

export function deleteCode(email) {
    codes.delete(email);
}