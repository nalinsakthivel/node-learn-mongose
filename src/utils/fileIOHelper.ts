import fs from "fs/promises";
import { logger } from "./logger";

export const writePhotoFile = async (photo: string): Promise<string> => {
  try {
    const buffer = Buffer.from(photo, "base64");
    const filename = `uploads/photo-${Date.now()}.jpg`;
    await fs.writeFile(filename, buffer);
    return filename;
  } catch (error) {
    console.error("Error writing file:", error);
    logger.error("Error writing file:", error);
    throw new Error("Error writing file");
  }
};

export const readPhotoFile = async (filename: string): Promise<string> => {
  try {
    const data = await fs.readFile(filename);
    return data.toString("base64");
  } catch (error) {
    console.error("Error reading file:", error);
    logger.error("Error reading file:", error);
    throw new Error("Error reading file");
  }
};

export const base64ToLink = async (
  base64: string,
  id: number
): Promise<string> => {
  try {
    const buffer = Buffer.from(base64, "base64");
    const filename = `uploads/${id}.jpg`;
    const baseUrl = "http://localhost:3000";
    await fs.mkdir("uploads", { recursive: true });
    await fs.writeFile(filename, buffer);
    return `${baseUrl}/${filename}`;
  } catch (error) {
    console.error("Error converting base64 to link:", error);
    logger.error("Error converting base64 to link:", error);
    throw new Error("Error converting base64 to link");
  }
};
