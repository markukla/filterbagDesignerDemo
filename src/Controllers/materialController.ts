import * as express from 'express';

import Controller from 'interfaces/controller.interface';

import validationMiddleware from "../middleware/validation.middleware";


import User from "../Models/Users/user.entity";
import CreatePrivilegedUserDto from "../Models/Users/PrivilegedUsers/user.dto";

import authMiddleware from "../middleware/auth.middleware";
import adminAuthorizationMiddleware from "../middleware/adminAuthorization.middleware";
import UserService from "../RepositoryServices/userRepositoryService";
import UserNotFoundException from "../Exceptions/UserNotFoundException";
import ChangePasswordDto from "../authentication/changePassword.dto";
import UpdatePrivilegedUserWithouTPasswordDto from "../Models/Users/PrivilegedUsers/modyfyUser.dto";
import Material from "../Models/Materials/material.entity";
import MaterialService from "../RepositoryServices/materialRepositoryService";
import CreateMaterialDto from "../Models/Materials/material.dto";
import MaterialNotFoundExceptionn from "../Exceptions/MaterialNotFoundException";
import setCORSAllowHeader from "../middleware/addCORSOrginAccessHeader";
import {MaterialEndpoint} from "../Models/Materials/materialOnEndpoint";
const url = require('url');



class MaterialController implements Controller{
    public path = '/materials';
    public router = express.Router();
    public  service:MaterialService=new MaterialService();
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, authMiddleware,this.getAllMaterials);
        this.router.get(`${this.path}/:id`, authMiddleware, this.getOneMaterialById);
        this.router.patch(`${this.path}/:id`,authMiddleware,adminAuthorizationMiddleware, validationMiddleware(CreateMaterialDto, true), this.updateMaterialById);
        this.router.delete(`${this.path}/:id`,authMiddleware,adminAuthorizationMiddleware, this.deleteOneMaterialById);
        this.router.post(this.path, authMiddleware,adminAuthorizationMiddleware, validationMiddleware(CreateMaterialDto), this.addOneMaterial);
        this.router.post(`${this.path}/codes`, authMiddleware,adminAuthorizationMiddleware, this.findMaterialByCode);
        this.router.post(`${this.path}/names`, authMiddleware,adminAuthorizationMiddleware, this.findMaterialByName);
        this.router.get(`${this.path}/codes/:code`,authMiddleware,adminAuthorizationMiddleware, this.materialWithThisCodeExist);
        this.router.get(`${this.path}/names/:name`,authMiddleware,adminAuthorizationMiddleware, this.materialWithThisNameExist);
    }
//findOneMaterialByCode
    private addOneMaterial = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const materialData: CreateMaterialDto = request.body;
        try {
            const material:Material = await this.service.addOneMaterial(materialData);
const materialEndpoint: MaterialEndpoint = {...material};
            response.json(
                materialEndpoint);
        } catch (error) {
            next(error);
        }
    }


    private updateMaterialById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const materialData:CreateMaterialDto=request.body;
        const id:string=request.params.id;
        try {
            const updatedMaterial = await this.service.updateMaterialById(id, materialData);
            if(updatedMaterial){
                response.send(updatedMaterial)}
            else {next(new MaterialNotFoundExceptionn(id));

            }
        }
        catch (error) {
            next(error);
        }

    }

    private getAllMaterials = async (request: express.Request, response: express.Response, next: express.NextFunction)=>
    {
        try{
            const materials:Material[]=await this.service.findAllMaterials();

            /*
            one way to hide information which sholul be removed from final endpoint:
            users.forEach(user=>{
                user.code=undefined;
                user.businesPartnerCompanyName=undefined;
                user.roles=undefined;
                user.id=undefined;
                user.password=undefined;
            });
        */

            response.send(materials);


        }
        catch (error) {
            next(error);
        }


    }

    private getOneMaterialById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const id:string=request.params.id;
        try{
            const foundMaterial=await this.service.findOneMaterialById(id);
            if(foundMaterial){
                response.send(foundMaterial)
            }
            else {
                next(new MaterialNotFoundExceptionn(id));
            }
        }
        catch (error) {
            next(error);
        }



    }
    private deleteOneMaterialById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const id:string=request.params.id;
        try{
            const deleTedResponse=await this.service.deleteMaterialById(id);
            if(deleTedResponse.affected===1){
                response.send({
                    status:200,
                    message:`material with id= ${id} has beeen removed`
                })
            }
            else {
                next(new MaterialNotFoundExceptionn(id));
            }
        }
        catch (error) {
            next(error);
        }

    }
    private findMaterialByCode = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{


        const code: string = request.body.code;
        try {
            const foundMaterial = await this.service.findOneMaterialByMaterialCode(code);

            response.send(foundMaterial);
        }
        catch (error) {
            next(error);
        }



    }
    private findMaterialByName = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{


        const code: string = request.body.name;
        try {
            const foundMaterial = await this.service.findOneMaterialByMaterialName(code);

            response.send(foundMaterial);
        }
        catch (error) {
            next(error);
        }



    }

    private materialWithThisCodeExist = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{


        const code = request.params.code;
        let isTaken: boolean =false;
        try {
            const foundMaterial = await this.service.findOneMaterialByMaterialCode(code);
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

    private materialWithThisNameExist = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{


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



    }



}

export default MaterialController;
