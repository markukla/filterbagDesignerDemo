import HttpException from "./HttpException";

class BusinessPartnerWithThisCodeAndDiffrentNameAlreadyExist extends HttpException {
    constructor(name: string) {

        if(name){
            super(400, `Wrong Business Partner Company Name: For this code have been already asigned name=${name}`);
        }


    }
}

export default BusinessPartnerWithThisCodeAndDiffrentNameAlreadyExist;
