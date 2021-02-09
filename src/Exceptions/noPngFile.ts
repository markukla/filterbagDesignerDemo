import HttpException from "./HttpException";

class NoPngFileException extends HttpException{

    constructor() {
        super(403,`Only .png files are allowed`);
    }
}
export default NoPngFileException;
