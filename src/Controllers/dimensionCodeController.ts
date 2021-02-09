import Controller from "../interfaces/controller.interface";
import * as express from "express";
import MaterialService from "../RepositoryServices/materialRepositoryService";
import authMiddleware from "../middleware/auth.middleware";
import adminAuthorizationMiddleware from "../middleware/adminAuthorization.middleware";
import validationMiddleware from "../middleware/validation.middleware";
import CreateMaterialDto from "../Models/Materials/material.dto";
import Material from "../Models/Materials/material.entity";
import {MaterialEndpoint} from "../Models/Materials/materialOnEndpoint";
import MaterialNotFoundExceptionn from "../Exceptions/MaterialNotFoundException";
import DimensionCodeService from "../RepositoryServices/dimensionCodeRepositoryService";
import CreateDimensionCodeDto from "../Models/DimesnionCodes/createDimensionCode.dto";
import DimensionCode from "../Models/DimesnionCodes/diemensionCode.entity";

class DimensionCodeController implements Controller{
    public path = '/dimensionCodes';
    public router = express.Router();
    public  service:DimensionCodeService=new DimensionCodeService();
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, authMiddleware,this.getAllDimensions);
        this.router.get(`${this.path}/:id`, authMiddleware, this.getOneDimensionCodeById);
        this.router.get(`${this.path}/codes/:code`,authMiddleware,adminAuthorizationMiddleware, this.dimensionWithThisCodeExists);
        this.router.get(`${this.path}/roles/indexDimensions/first`, authMiddleware, this.getAllFirstIndexDimensions);
        this.router.get(`${this.path}/roles/indexDimensions/second`, authMiddleware, this.getAllSecondIndexDimensions)
        this.router.get(`${this.path}/roles/indexDimensions/non`, authMiddleware, this.getAllNoIndexRelateDimensionCodes)
        this.router.patch(`${this.path}/:id`, authMiddleware,adminAuthorizationMiddleware, validationMiddleware(CreateDimensionCodeDto, true), this.updateDimensionCode);
        this.router.delete(`${this.path}/:id`,authMiddleware,adminAuthorizationMiddleware, this.deleteOneDimensionById);
        this.router.post(this.path, authMiddleware,adminAuthorizationMiddleware, validationMiddleware(CreateDimensionCodeDto), this.addOneDimensionCode);
       // this.router.get(`${this.path}/names/:name`,authMiddleware,adminAuthorizationMiddleware, this.materialWithThisNameExist);
    }
//findOneMaterialByCode
    private addOneDimensionCode = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const dimensionData: CreateDimensionCodeDto = request.body;
        try {
            const dimensionCode:DimensionCode = await this.service.addOneDimensionCode(dimensionData);
            response.send(
                dimensionCode);
        } catch (error) {
            next(error);
        }
    }


    private updateDimensionCode = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const dimensionData: CreateDimensionCodeDto = request.body;
        const id:string=request.params.id;
        try {
            const updatedDimension = await this.service.updateDimensionCodeById(id, dimensionData);
            if(updatedDimension){
                response.send(updatedDimension)
            }

        }
        catch (error) {
            next(error);
        }

    }

    private getAllDimensions = async (request: express.Request, response: express.Response, next: express.NextFunction)=>
    {
        try{
            const dimensions:DimensionCode[]=await this.service.findAllDimensionCodes();

            response.send(dimensions);
        }
        catch (error) {
            next(error);
        }
    }

    private getAllFirstIndexDimensions = async (request: express.Request, response: express.Response, next: express.NextFunction)=>
    {
        try{
            const dimensions:DimensionCode[]=await this.service.findallFirstIndexDimensionCodes();

            response.send(dimensions);
        }
        catch (error) {
            next(error);
        }
    }
    private getAllSecondIndexDimensions = async (request: express.Request, response: express.Response, next: express.NextFunction)=>
    {
        try{
            const dimensions:DimensionCode[]=await this.service.findallSecondIndexDimensionCodes();

            response.send(dimensions);
        }
        catch (error) {
            next(error);
        }
    }
    private getAllNoIndexRelateDimensionCodes = async (request: express.Request, response: express.Response, next: express.NextFunction)=>
    {
        try{
            const dimensions:DimensionCode[]=await this.service.findallNoIndexRelatedDimensionCodes();

            response.send(dimensions);
        }
        catch (error) {
            next(error);
        }
    }

    private getOneDimensionCodeById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const id:string=request.params.id;
        try{
            const foundDimension=await this.service.findOneById(id);
            if(foundDimension){
                response.send(foundDimension)
            }
        }
        catch (error) {
            next(error);
        }



    }
    private deleteOneDimensionById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const id:string=request.params.id;
        try{
            const deleTedResponse=await this.service.deleteOneById(id);
            if(deleTedResponse.affected===1){
                response.send({
                    status:200,
                    message:`material with id= ${id} has beeen removed`
                })
            }

        }
        catch (error) {
            next(error);
        }

    }

    private dimensionWithThisCodeExists = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{


        const code = request.params.code;
        let isTaken: boolean =false;
        try {
            const foundMaterial = await this.service.findOneByDimensionCode(code);
            if (foundMaterial) {
                isTaken= true;

            }
            else {
                isTaken= false;
            }
            response.send(isTaken);
        }
        catch (error) {
            next(error);
        }



    }
/* private materialWithThisNameExist = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{


        const code = request.params.name;
        let isTaken: boolean =false;
        try {
            const foundMaterial = await this.service.findOneMaterialByMaterialName(code);
            if (foundMaterial) {
                isTaken= true;

            }
            else {
                isTaken= false;
            }
            response.send(isTaken);
        }
        catch (error) {
            next(error);
        }



    }*/




}

export default DimensionCodeController;
