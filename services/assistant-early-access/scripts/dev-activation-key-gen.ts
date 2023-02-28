import { randomBytes } from "crypto";

for (let i = 0; i < 100; i++) {
  // Generate a random buffer
  const randomBuffer = randomBytes(16);

  // Convert the buffer to a string and pad it with leading zeros
  const key = randomBuffer.toString("hex");

  // Construct the activation key with the prefix and padded number
  const activationKey = `GAEBAK-${key}`;
  // Output the activation key
  console.log(activationKey);
}
