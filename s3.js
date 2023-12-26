import aws from "aws-sdk";
import dotenv from "dotenv";
import crypto from "crypto";
import { promisify } from "util";

// // Newest Best practice to use Credentials file. Try later.
// var credentials = new AWS.SharedIniFileCredentials({
//   profile: "recipe-book-account",
// });
// AWS.config.credentials = credentials;

// Old Way that will be deprecated using env file

dotenv.config();
const randomBytes = promisify(crypto.randomBytes);

const region = "us-east-1";
const bucketName = "fred-g-recipe-book-storage";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

async function generateUploadURL(imageType) {
  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString("hex");
  const imageUrl = `${imageName}.${imageType}`;

  const params = {
    Bucket: bucketName,
    Key: imageUrl,
    Expires: 60,
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);
  // return uploadURL;
  return { url: uploadURL, type: imageType };
}

export { generateUploadURL };
