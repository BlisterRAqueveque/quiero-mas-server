import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import fs = require('fs');

import path = require('path');

/**
 * @description
 * Valid mime type (files) supported
 */
const validMimeType: string[] = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/pdf',
];

export const saveImagesToStorage = (destination) => {
  return {
    storage: diskStorage({
      destination: `./uploads/${destination}`,
      filename: (req, file, callback) => {
        const fileExtension: string = path.extname(file.originalname);
        const filename: string = uuidv4() + fileExtension;
        callback(null, filename);
      },
    }),
    fileFilter: (req, file, callback) => {
      validMimeType.includes(file.mimetype)
        ? callback(null, true)
        : callback(null, false);
    },
  };
};

//! Update file function
export const removeFile = (fullFilePath: string) => {
  try {
    fs.unlinkSync(fullFilePath);
  } catch (e) {
    console.error(new Date(), e);
  }
};
