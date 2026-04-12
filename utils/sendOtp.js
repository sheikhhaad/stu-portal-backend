import bcrypt from "bcrypt";

export const generateOTP = () =>
  Math.floor(1000 + Math.random() * 9000).toString();

export const hashOTP = (otp) => bcrypt.hash(otp, 10);

export const compareOTP = (otp, hash) => bcrypt.compare(otp, hash);
