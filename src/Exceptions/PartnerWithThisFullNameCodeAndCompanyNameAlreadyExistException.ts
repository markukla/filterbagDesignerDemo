import HttpException from "./HttpException";


class PartnerWithThisFullNameCodeAndCompanyNameAlreadyExistException extends HttpException {
    constructor(fullName: string, companyName: string, code:string,) {
        super(400, `Partner with fullName= ${fullName}, companyName= ${companyName}, code=${code}  already exists`);
    }
}

export default PartnerWithThisFullNameCodeAndCompanyNameAlreadyExistException;
