import { sign, verify } from 'jsonwebtoken';

export class JWT {
    private privateKey: string;
    private publicKey: string;

    constructor(publicKey: string, privateKey: string) {
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }

    async decodeAndVerifyToken(jwtToken: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            verify(
                jwtToken,
                this.publicKey,
                { algorithms: ['RS256'] },
                (err, decoded) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(decoded);
                }
            );
        });
    }
    async signPayload(payload: object, duration: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            sign(
                payload,
                this.privateKey,
                { algorithm: 'RS256', expiresIn: duration },
                (err, token) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(token);
                }
            );
        });
    }
}
