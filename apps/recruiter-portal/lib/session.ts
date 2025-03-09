import { importSPKI, jwtVerify } from "jose";
import { env } from "./env";

export async function unsign(signedValue: string): Promise<Record<string, string>> {
    const publicKey = await importSPKI(env.RSA_PUBLIC_KEY, "RS256");

    const { payload } = await jwtVerify(signedValue, publicKey, {
        algorithms: ["RS256"],
    });

    console.log("decoded", payload);

    if (typeof payload !== "object" || payload === null) {
        throw new Error("Invalid token");
    }

    return payload as Record<string, string>;
}
