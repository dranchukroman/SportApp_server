import redis from "../../config/redisConfig.js";

export function generateCode() {
    const code = Math.floor(Math.random() * 999999) + 1;
    return code.toString().padStart(6, '0');
}

export async function storeCode(email, code) {
    const key = `verify:${email}`;
    const value = JSON.stringify({ code });
    await redis.set(key, value, 'EX', 600); // Time in seconds
}

export async function getCodeData(email) {
    const key = `verify:${email}`;
    const data = await redis.get(key);
    if (!data) return false;
    return JSON.parse(data);
}

export async function verifyCode(email, inputCode) {
    const data = await getCodeData(email);
    if (!data) return false;

    const isValid = Number(data.code) === Number(inputCode);
    if(isValid) {
        await deleteCode(email);
    }
    return isValid;
}

export async function deleteCode(email) {
    const key = `verify:${email}`;
    await redis.del(key);
}