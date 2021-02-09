import * as express from 'express';

import Controller from 'interfaces/controller.interface';
import validationMiddleware from "../middleware/validation.middleware";
import ProductBottomService from "../RepositoryServices/productBottomRepository";
import CreateProductBottomDto from "../Models/Products/createProductBottom.dto";
import ProductBottom from "../Models/Products/productBottom.entity";
import ProductBottomNotFoundException from "../Exceptions/ProductBottomNotFoundException";
import authMiddleware from "../middleware/auth.middleware";
import adminAuthorizationMiddleware from "../middleware/adminAuthorization.middleware";


class ProductBottomController implements Controller {
    public path = '/productBottoms';
    public router = express.Router();
    public service: ProductBottomService = new ProductBottomService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, authMiddleware, this.getAllProductBottoms);
        this.router.get(`${this.path}/:id`, authMiddleware, this.getOneProductBottomById);
        this.router.patch(`${this.path}/:id`,  authMiddleware,adminAuthorizationMiddleware, validationMiddleware(CreateProductBottomDto, true), this.updateProductTypeById);
        this.router.delete(`${this.path}/:id`, authMiddleware,adminAuthorizationMiddleware, this.deleteOneProductBottomById);
        this.router.post(this.path, authMiddleware,adminAuthorizationMiddleware, validationMiddleware(CreateProductBottomDto), this.addOneProductBottom);
        this.router.get(`${this.path}/codes/:code`,authMiddleware, this.isCodeTaken);
        this.router.get(`${this.path}/:id/codes/:code`,authMiddleware, this.isCodeTakenForUpdate);
    }

    private isCodeTaken = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id: string = request.params.id;
        const code: string= request.params.code;
        try {
            const foundProductTop = await this.service.findOneProductBottomByCode(code);
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
            const foundProductTop = await this.service.findOneProductBottomByCode(code);
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


    private addOneProductBottom = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const productBottomData: CreateProductBottomDto = request.body;
        try {
            const productBottom: ProductBottom = await this.service.addOneProductBottom(productBottomData);

            response.send(productBottom);
        } catch (error) {
            next(error);
        }
    }


    private updateProductTypeById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const productBottom: CreateProductBottomDto = request.body;
        const id: string = request.params.id;
        try {
            const updatedProductBottom = await this.service.updateProductBottomById(id, productBottom);

            response.send({
                message:"Product Bottom updated",
                updatedProductBottom:updatedProductBottom
            });
        } catch (error) {
            next(error);
        }

    }

    private getAllProductBottoms = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const productBottoms: ProductBottom[] = await this.service.findAllProductsBottoms();


            response.send(productBottoms);


        } catch (error) {
            next(error);
        }


    }

    private getOneProductBottomById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id: string = request.params.id;
        try {
            const foundProductBottom:ProductBottom = await this.service.findOneProductBottomById(id);
            if (foundProductBottom) {
                response.send(foundProductBottom)
            } else {
                next(new ProductBottomNotFoundException(id));
            }
        } catch (error) {
            next(error);
        }


    }
    private deleteOneProductBottomById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id: string = request.params.id;
        try {
            const deleTedResponse = await this.service.deleteProductBottomById(id);
            if (deleTedResponse.affected === 1) {
                response.send({
                    status: 200,
                    message: `ProductBottom with id= ${id} has beeen removed`
                })
            } else {
                next(new ProductBottomNotFoundException(id));
            }
        } catch (error) {
            next(error);
        }

    }


}

export default ProductBottomController;
