import bcrypt from "bcryptjs";

export const hashedPasswordUtil = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const passwordMatchUtil = async (password, storedPassword) => {
    return await bcrypt.compare(password, storedPassword);
}
