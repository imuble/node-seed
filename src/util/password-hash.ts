import { hash, compare } from 'bcrypt';

const saltRounds = 10;

export async function validatePassword(
    plainPassword: string,
    hashedPassword: string
): Promise<boolean> {
    return await compare(plainPassword, hashedPassword);
}

export async function hashValue(value: string) {
    return await hash(value, saltRounds);
}
