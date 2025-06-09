import { Request } from "express";
import { Multer } from "multer";

// add file since typescript can't recognise the upload.file on my route, so it's now included in the request property
declare module "express-serve-static-core" {
  interface Request {
    file?: Multer.File;
  }
}
