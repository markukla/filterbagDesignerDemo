import HttpException from "./HttpException";


class ProductBottomAlreadyExistsException extends HttpException {
    constructor() {
        super(400,"ProductBottom which you are trying to add already exist in database");

    }
}

export default ProductBottomAlreadyExistsException;
