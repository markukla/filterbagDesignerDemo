import * as express from 'express';
import Controller from 'interfaces/controller.interface';
import CreateProductTopDto from "../Models/Products/createProductTop.dto";
import authMiddleware from "../middleware/auth.middleware";
import adminAuthorizationMiddleware from "../middleware/adminAuthorization.middleware";
import OrderForSapRepository from "../RepositoryServices/orderForSapRepository";
import OrderToExport from "../Models/Order/orderEntityExportMSSQL";


class OrderForSapController implements Controller {
    public path = '/api/SapOrders';
    public router = express.Router();
    public service: OrderForSapRepository = new OrderForSapRepository();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, authMiddleware, this.getAllRecords);
        this.router.get(`${this.path}/:id`, authMiddleware, this.getOneRecordById);
        this.router.post(this.path, authMiddleware,adminAuthorizationMiddleware, this.addOneRecord);


    }

    private addOneRecord = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const orderForSapData: any = request.body;
        try {
            const orderForSAp: OrderToExport = await this.service.addOneRecord(orderForSapData);

            response.send(orderForSAp);
        } catch (error) {
            next(error);
        }
    }


    private updateRecordById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const productTOp: CreateProductTopDto = request.body;
        const id: string = request.params.id;
        try {




        } catch (error) {
            next(error);
        }

    }

    private getAllRecords = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const records: OrderToExport[] = await this.service.findAllRecords();


            response.send(records);


        } catch (error) {
            next(error);
        }


    }

    private getOneRecordById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id: string = request.params.id;
        try {
            const foundRecord = await this.service.findOneOrder(id);
            if (foundRecord) {
                response.send(foundRecord)
            } else {

            }
        } catch (error) {
            next(error);
        }


    }







    private deleteOneById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id: string = request.params.id;
        try{

        }
        catch (error) {
            next(error);
        }


    }


}

export default OrderForSapController;
