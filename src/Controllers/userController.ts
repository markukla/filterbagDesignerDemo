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
import CHangePasswordByAdminDto from "../Models/Users/changePasswordByAdmin.dto";
import BlockUserDto from "../Models/Users/blockUser.dto";
import editorAuthorizationMiddleware from "../middleware/editorAuthorizationMiddleware";



class UserController implements Controller{
    public path = '/users';
    public router = express.Router();
    public  service:UserService=new UserService();
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, authMiddleware,adminAuthorizationMiddleware,this.getAllUsers);
        this.router.get(`${this.path}/:id`,authMiddleware,adminAuthorizationMiddleware, this.getOneUserById);
        this.router.patch(`${this.path}/:id`,authMiddleware,adminAuthorizationMiddleware, validationMiddleware(CreatePrivilegedUserDto, true), this.updateUserById);
        this.router.patch(`${this.path}/:id/changePassword`,authMiddleware,adminAuthorizationMiddleware, validationMiddleware(CHangePasswordByAdminDto, true), this.changePasswordByAdmin);
        this.router.patch(`${this.path}/:id/blockOrUnblock`,authMiddleware,adminAuthorizationMiddleware, validationMiddleware(BlockUserDto, true), this.blockOrUnblockUser)
        this.router.delete(`${this.path}/:id`,authMiddleware,adminAuthorizationMiddleware, this.deleteOneUserById);
        this.router.post(this.path, authMiddleware,adminAuthorizationMiddleware,validationMiddleware(CreatePrivilegedUserDto), this.registerOneUser);
     this.router.get(`${this.path}/admins`,authMiddleware,adminAuthorizationMiddleware, this.getAllAdmins);
        this.router.get(`${this.path}/editors`,authMiddleware,adminAuthorizationMiddleware, this.getAllEditors);
        this.router.get(`${this.path}/emails/:email`,authMiddleware,adminAuthorizationMiddleware, this.isEmailTaken)
        this.router.get(`${this.path}/:id/emails/:email`,authMiddleware,editorAuthorizationMiddleware, this.isEmailTakenByOtherUser)
    }

    private registerOneUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const userData: CreatePrivilegedUserDto = request.body;
        try {
            const user = await this.service.registerPrivilegedUser(userData);

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



    private updateUserById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const userData:UpdatePrivilegedUserWithouTPasswordDto=request.body;
        const id:number=Number(request.params.id);
        try {
            const modyfiedUser = await this.service.updatePrivilegedUserWithoutPasssword(id, userData);
if(modyfiedUser){
    response.send(modyfiedUser)}
else {next(new UserNotFoundException(String(id)));

}
        }
        catch (error) {
            next(error);
            }

        }

private getAllUsers = async (request: express.Request, response: express.Response, next: express.NextFunction)=>
{
try{
    const users:User[]=await this.service.getAllPrivilegedUsers();

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
    response.send(users);


}
catch (error) {
    next(error);
}


}

    private getAllAdmins = async (request: express.Request, response: express.Response, next: express.NextFunction)=>
    {
        try{
            const users:User[]=await this.service.getAllAdmins();

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
            response.send(users);


        }
        catch (error) {
            next(error);
        }


    }
    private getAllEditors = async (request: express.Request, response: express.Response, next: express.NextFunction)=>
    {
        try{
            const users:User[]=await this.service.getAllEditors();

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
            response.send(users);


        }
        catch (error) {
            next(error);
        }


    }



private getOneUserById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
const id:string=request.params.id;
        try{
    const foundUser=await this.service.findOnePrivilegedUserById(id);
    if(foundUser){
        response.send(foundUser)
    }
    else {
       next(new UserNotFoundException(String(id))) ;
    }
}
        catch (error) {
            next(error);
        }



}
    private deleteOneUserById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const id:number=Number(request.params.id);
        try{
            const deleTedResponse=await this.service.deletePrivilegedUserById(id);
            if(deleTedResponse.affected===1){
                response.send({
                    status:200,
                    message:`user with id= ${id} has beeen removed`
                })
            }
            else {
                next(new UserNotFoundException(String(id))) ;
            }
        }
        catch (error) {
            next(error);
        }

    }

    private changePasswordByAdmin = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{

        try{
            const id:string=request.params.id;
            const user=await this.service.findOnePrivilegedUserById(id);
            if(user) {
                const passwordData: CHangePasswordByAdminDto = request.body;
                const userWithChangedPassword = await this.service.changePrivilegedUserPasswordByAdmin(user, passwordData);
                response.send(userWithChangedPassword);
            }
            else {
                next(new UserNotFoundException(String(id))) ;
            }
        }
        catch (error) {
            next(error);
        }



    }

    private blockOrUnblockUser = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{

        try{
            const id:string=request.params.id;
            const user=await this.service.findOnePrivilegedUserById(id);
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

export default UserController;
