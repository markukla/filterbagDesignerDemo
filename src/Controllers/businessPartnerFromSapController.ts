import * as express from 'express';
import Controller from 'interfaces/controller.interface';

import authMiddleware from "../middleware/auth.middleware";
import adminAuthorizationMiddleware from "../middleware/adminAuthorization.middleware";
import OrderForSapRepository from "../RepositoryServices/orderForSapRepository";
import editorAuthorizationMiddleware from "../middleware/editorAuthorizationMiddleware";
import BusinessPartnerFromSapRepositoryService from "../RepositoryServices/businessPartnerFromSapRepositoryService";

class BusinessPartnerFromSapController implements Controller {
    public path = '/api/SapPartners';
    public router = express.Router();
    public service: BusinessPartnerFromSapRepositoryService = new BusinessPartnerFromSapRepositoryService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/:code`, authMiddleware, editorAuthorizationMiddleware, this.getOneRecordByCode);
    }






    private getOneRecordByCode = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const code: string = request.params.code;
        try {
            const foundRecord = await this.service.findOneBusinessPartnerBYCode(code);
            if (foundRecord) {
                response.send(foundRecord)
            } else {
                response.send(null)
            }
        } catch (error) {
            next(error);
        }


    }


}

export default BusinessPartnerFromSapController;
