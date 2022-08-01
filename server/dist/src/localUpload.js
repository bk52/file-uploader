"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LocalUpload = (file, filename, path) => {
    return new Promise((resolve, reject) => {
        file.mv(`${path}${filename}`, (e) => {
            if (e)
                reject(e);
            resolve(filename);
        });
    });
};
exports.default = LocalUpload;
