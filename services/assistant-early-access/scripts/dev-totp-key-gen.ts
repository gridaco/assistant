import * as base32 from "thirty-two";
import { randomBytes } from "crypto";

for (let i = 0; i < 100; i++) {
  // Generate a random secret key
  const secretKey = randomBytes(20);

  // Encode the secret key in base32 format
  const encodedKey = base32.encode(secretKey).toString();
  const qr =
    "otpauth://totp/Assistant%20Early%20Acess?secret=" +
    encodedKey +
    "&issuer=Grida";

  // Output the secret key and QR code URL
  console.log(encodedKey, qr);
}
