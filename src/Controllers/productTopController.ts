import * as express from 'express';

import Controller from 'interfaces/controller.interface';

import CreateProductTypeDto from "../Models/Products/createProductType.dto";

import validationMiddleware from "../middleware/validation.middleware";
import ProductTopService from "../RepositoryServices/ProductTopRepository";
import CreateProductTopDto from "../Models/Products/createProductTop.dto";
import ProductTop from "../Models/Products/productTop.entity";
import ProductTopNotFoundException from "../Exceptions/ProductTopNotFoundException";
import authMiddleware from "../middleware/auth.middleware";
import adminAuthorizationMiddleware from "../middleware/adminAuthorization.middleware";


class ProductTopController implements Controller {
    public path = '/productTops';
    public router = express.Router();
    public service: ProductTopService = new ProductTopService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, authMiddleware, this.getAllProductTopes);
        this.router.get(`${this.path}/:id`, authMiddleware, this.getOneProductTopById);
        this.router.patch(`${this.path}/:id`, authMiddleware,adminAuthorizationMiddleware,  validationMiddleware(CreateProductTopDto, true), this.updateProductTypeById);
        this.router.delete(`${this.path}/:id`, authMiddleware,adminAuthorizationMiddleware,  this.deleteOneProductTypeById);
        this.router.post(this.path, authMiddleware,adminAuthorizationMiddleware,  validationMiddleware(CreateProductTopDto), this.addOneProductTope);
        this.router.get(`${this.path}/codes/:code`, authMiddleware, this.isCodeTaken);
        this.router.get(`${this.path}/:id/codes/:code`, authMiddleware, this.isCodeTakenForUpdate);
    }

    private addOneProductTope = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const productTopData: CreateProductTopDto = request.body;
        try {
            const productTop: ProductTop = await this.service.addOneProductTope(productTopData);

            response.send(productTop);
        } catch (error) {
            next(error);
        }
    }


    private updateProductTypeById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const productTOp: CreateProductTopDto = request.body;
        const id: string = request.params.id;
        try {
            const updatedProductTop = await this.service.updateProductTopById(id, productTOp);

            response.send({
                message:"Product Top updated",
                updatedProductTop:updatedProductTop
            });
        } catch (error) {
            next(error);
        }

    }

    private getAllProductTopes = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const productTops: ProductTop[] = await this.service.findAllProductsTops();


            response.send(productTops);


        } catch (error) {
            next(error);
        }


    }

    private getOneProductTopById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id: string = request.params.id;
        try {
            const foundProductTop = await this.service.findOneProductTopById(id);
            if (foundProductTop) {
                response.send(foundProductTop)
            } else {
                next(new ProductTopNotFoundException(id));
            }
        } catch (error) {
            next(error);
        }


    }
    private isCodeTaken = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id: string = request.params.id;
        const code: string= request.params.code;
        try {
            const foundProductTop = await this.service.findOneProductTopByCode(code);
            if(foundProductTop) {
                response.send(true);
            }
            else {
                response.send(false);
            }



        } catch (error) {
            next(error);
        }


    }

    private isCodeTakenForUpdate = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id: string = request.params.id;
        const code: string= request.params.code;
        try {
            const foundProductTop = await this.service.findOneProductTopByCode(code);
            if(foundProductTop&&foundProductTop.id!==Number(id)) {
                response.send(true);
            }
            else {
                response.send(false);
            }

        } catch (error) {
            next(error);
        }
    }



    private deleteOneProductTypeById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id: string = request.params.id;
        try{
            const deleTedResponse: boolean =await this.service.deleteProductTopById(id);

            response.send(deleTedResponse);
        }
        catch (error) {
            next(error);
        }


    }


}

export default ProductTopController;
