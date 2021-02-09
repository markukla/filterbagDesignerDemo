import HttpException from "./HttpException";

class DimensionCodeAlreadyExistException extends HttpException {
    constructor(dimensionCode?: string) {

        if(dimensionCode){
            super(400, `DimensionCode with diemnsionCode= ${dimensionCode} already exists`);
        }
        else {
            super(400, `DimensionCode which you are trying to add already exists`);
        }


    }
}

export default DimensionCodeAlreadyExistException;
