"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const http_status_codes_1 = require("http-status-codes");
const fileUpload_1 = __importDefault(require("./src/fileUpload"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const UPLOAD_FOLDER = 'uploads';
const UPLOAD_PATH = `${__dirname}/${UPLOAD_FOLDER}/`;
const Init = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!fs_1.default.existsSync(`./dist/${UPLOAD_FOLDER}`))
            fs_1.default.mkdirSync(`./dist/${UPLOAD_FOLDER}`);
        app.use((0, cors_1.default)());
        app.use((0, express_fileupload_1.default)({
            uriDecodeFileNames: true,
            safeFileNames: true,
            preserveExtension: true
        }));
        app.use(body_parser_1.default.json());
        app.use(body_parser_1.default.urlencoded({ extended: true }));
        app.use('/static', express_1.default.static(path_1.default.join(__dirname, `/${UPLOAD_FOLDER}`)));
        app.post("/upload", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (!req.files || Object.keys(req.files).length === 0)
                    return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send('No files were uploaded.');
                const result = yield (0, fileUpload_1.default)(req.files, {
                    uploadLocal: true,
                    uploadS3Bucket: true,
                    uploadPath: UPLOAD_PATH,
                    randomFileName: false,
                });
                return res.status(result.code).send({ message: result.message, files: result.result });
            }
            catch (e) {
                console.error('Error Uploads -> ' + e);
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: "File upload failed" });
            }
        }));
        app.listen(PORT, () => { console.log("Server started port : " + PORT); });
    }
    catch (e) {
        console.error(`Server couldn't start`);
        console.error(e);
    }
});
Init();
