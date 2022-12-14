const crypto = require("crypto");

// The two keys gotten from Trustpilot
let encryptionKeyBase64 = "71WTH8LHhCQhThsL8BkF4aWCFlK25R8pWOjOdMdx1/U=";
let authenticationKeyBase64 = "YZR8Z6cRZ7nCR8jfEQZrtXAvN49fmdknz+/jjxEWhg8=";
let domain = "rewe-group.tp-testing.com";

// Our order to encrypt
let order = {
  email: "xyz@domain.com",
  name: "John Smith",
  ref: "1234",
  skus: ["sku1", "sku2", "sku3"],
  tags: ["tag1", "tag2", "tag3"],
};
let jsonSerializedOrder = JSON.stringify(order);

// When you get the keys from Trustpilot, they are base64 encoded, so first we need to decode them
let encryptionKey = Buffer.from(encryptionKeyBase64, "base64");
let authenticationKey = Buffer.from(authenticationKeyBase64, "base64");

// Generate a random initialization vector
let iv = crypto.randomBytes(16);

// Encrypt our order
let cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv);
let cipherText = Buffer.concat([
  cipher.update(jsonSerializedOrder, "utf8"),
  cipher.final(),
]);

// Compute the HMAC
let hmac = crypto
  .createHmac("sha256", authenticationKey)
  .update(Buffer.concat([iv, cipherText]))
  .digest();

// Base64 encode the IV + cipherText + HMAC
let base64Payload = Buffer.concat([iv, cipherText, hmac]).toString("base64");

// URL encode to get the final payload
let payload = encodeURIComponent(base64Payload);

// The final url
let url = "https://www.trustpilot.com/evaluate-bgl/" + domain + "?p=" + payload;

console.log(url);
