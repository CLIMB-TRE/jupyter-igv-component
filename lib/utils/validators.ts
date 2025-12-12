import * as z from "zod";
const S3_URI_REGEX = /^s3:\/\/([a-z0-9.-]{1,})\/.*$/;
const S3_URI_MESSAGE =
  "Must be a valid S3 URI starting with 's3://' and including a bucket/key.";
export const s3URI = z.string().regex(S3_URI_REGEX, {
  message: S3_URI_MESSAGE,
});
