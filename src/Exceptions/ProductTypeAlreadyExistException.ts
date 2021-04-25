import HttpException from "./HttpException";


class ProductTypeAlreadyExistsException extends HttpException {
    constructor() {
        super(400,"ProductType with this code already exist in database");

    }
}

export default ProductTypeAlreadyExistsException;
