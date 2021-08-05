import HttpException from "./HttpException";

class BusinessPartnerWithThisCodeAlreadyExist extends HttpException {
    constructor(code: string) {

        if(code){
            super(400, `Business Partner with this code = ${code} already exists`);
        }


    }
}

export default BusinessPartnerWithThisCodeAlreadyExist;
