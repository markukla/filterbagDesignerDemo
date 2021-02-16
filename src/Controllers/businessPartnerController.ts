import * as express from 'express';

import Controller from 'interfaces/controller.interface';
import validationMiddleware from "../middleware/validation.middleware";

import UserNotFoundException from "../Exceptions/UserNotFoundException";
import ChangePasswordDto from "../authentication/changePassword.dto";
import CreateBusinessPartnerDto from "../Models/Users/BusinessPartner/businessPartner.dto";
import authMiddleware from "../middleware/auth.middleware";
import editorAuthorizationMiddleware from "../middleware/editorAuthorizationMiddleware";
import User from "../Models/Users/user.entity";
import UpdateBussinessPartnerWithoutPassword from "../Models/Users/BusinessPartner/modyfyBusinessPartent.dto";
import BusinessPartnerNotFoundException from "../Exceptions/BusinessPartnerNotFoundException";
import UserService from "../RepositoryServices/userRepositoryService";
import CHangePasswordByAdminDto from "../Models/Users/changePasswordByAdmin.dto";
import BlockUserDto from "../Models/Users/blockUser.dto";
import {models} from "mongoose";



class BusinessPartnerController implements Controller{
    public path = '/business_partners';
    public router = express.Router();
    public  service:UserService=new UserService();
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path,authMiddleware,editorAuthorizationMiddleware, this.getAllPartners);
        this.router.get(`${this.path}/:id`,authMiddleware,editorAuthorizationMiddleware, this.getOnePartnerById);
        this.router.patch(`${this.path}/:id`,authMiddleware,editorAuthorizationMiddleware, validationMiddleware(CreateBusinessPartnerDto, true), this.modyfyPartner);
        this.router.delete(`${this.path}/:id`,authMiddleware,editorAuthorizationMiddleware, this.deleteOnePartnerById);
        this.router.patch(`${this.path}/:id/changePassword`,authMiddleware,editorAuthorizationMiddleware, validationMiddleware(CHangePasswordByAdminDto, true), this.changePasswordByEditor);
        this.router.patch(`${this.path}/:id/blockOrUnblock`,authMiddleware,editorAuthorizationMiddleware, validationMiddleware(CHangePasswordByAdminDto, true), this.blockOrUnblockUser)
        this.router.post(this.path,validationMiddleware(CreateBusinessPartnerDto), this.registration);
        this.router.get(`${this.path}/emails/:email`,authMiddleware,editorAuthorizationMiddleware, this.isEmailTaken)
        this.router.get(`${this.path}/:id/emails/:email`,authMiddleware,editorAuthorizationMiddleware, this.isEmailTakenByOtherUser)
    }

    private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const businessPartnerData: CreateBusinessPartnerDto = request.body;
        try {
            const user = await this.service.registerBusinessPartner(businessPartnerData);

            response.send(user);
        } catch (error) {
            next(error);
        }
    }
    private isEmailTaken = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const email:string = request.params.email;
        try {
            const user = await this.service.findUserByEmail(email);
            if(user){
                response.send(true);
            }
            if(!user){
                response.send(false);
            }

        } catch (error) {
            next(error);
        }
    }
    private isEmailTakenByOtherUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const email:string = request.params.email;
        const id= Number(request.params.id);
        try {
            const user = await this.service.findUserByEmail(email);
            if(user&&user.id!==id){
                response.send(true);
            }
            else{
                response.send(false);
            }

        } catch (error) {
            next(error);
        }
    }


    private modyfyPartner = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const partnerData:UpdateBussinessPartnerWithoutPassword=request.body;
        const id:number=Number(request.params.id);
        try {
            const modyfiedPartner = await this.service.updatePartnerById(id, partnerData);
            if(modyfiedPartner){
                response.send(modyfiedPartner)}
            else {next(new UserNotFoundException(String(id)));

            }
        }
        catch (error) {
            next(error);
        }

    }

    private getAllPartners = async (request: express.Request, response: express.Response, next: express.NextFunction)=>
    {
        try{
            const businesParners:User[]=await this.service.getAllBusinessPartners();
            response.send(businesParners);


        }
        catch (error) {
            next(error);
        }


    }

    private getOnePartnerById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const id:string=request.params.id;
        try{
            const foundPartner=await this.service.findOnePartnerById(id);
            if(foundPartner){
                response.send(foundPartner)
            }
            else {
                next(new UserNotFoundException(String(id))) ;
            }
        }
        catch (error) {
            next(error);
        }



    }
    private deleteOnePartnerById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const id:number=Number(request.params.id);
        try{
            const deleTedResponse: boolean =await this.service.deletePartnerById(id);

                response.send(deleTedResponse);
        }
        catch (error) {
            next(error);
        }

    }

    private changePasswordByEditor = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const id:string=request.params.id;
        try{
            const businesPartner=await this.service.findOnePartnerById(id);
            if(businesPartner){
                const passwordData:CHangePasswordByAdminDto=request.body;
              await this.service.changePartnerPasswordByEditor(businesPartner,passwordData);
                response.send({status:200,
                    message:"password has been successfully updated"})

            }
            else {
                next(new BusinessPartnerNotFoundException(String(id))) ;
            }
        }
        catch (error) {
            next(error);
        }



    }
    private blockOrUnblockUser = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{

        try{
            const id:string=request.params.id;
            const user=await this.service.findOnePartnerById(id);
            if(user) {
                const activeData: BlockUserDto = request.body;
                const updatedUser = await this.service.blockOrUnblockUser(user, activeData);
                response.send(updatedUser);
            }
            else {
                next(new UserNotFoundException(String(id))) ;
            }
        }
        catch (error) {
            next(error);
        }



    }





}

export default BusinessPartnerController;
