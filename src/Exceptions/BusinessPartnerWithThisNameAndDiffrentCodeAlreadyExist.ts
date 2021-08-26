import HttpException from "./HttpException";

class BusinessPartnerWithThisNameAndDiffrentCodeAlreadyExist extends HttpException {
    constructor(code: string) {

        if(code){
            super(400, `Wrong Business Partner Company Name: This name is already taken by code=${code}`);
        }


    }
}

export default BusinessPartnerWithThisNameAndDiffrentCodeAlreadyExist;
