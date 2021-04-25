import HttpException from "./HttpException";


class ProductBottomAlreadyExistsException extends HttpException {
    constructor() {
        super(400,"ProductBottom with this code already exist in database");

    }
}

export default ProductBottomAlreadyExistsException;
