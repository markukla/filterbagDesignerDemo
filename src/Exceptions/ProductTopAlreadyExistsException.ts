import HttpException from "./HttpException";


class ProductTopAlreadyExistsException extends HttpException {
    constructor() {
        super(400,"ProductTop with this code already exist in database");

    }
}

export default ProductTopAlreadyExistsException;
