import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';

import User from "../Models/Users/user.entity";

import LogInDto from "./logIn.dto";
import WrongCredentialsException from "../Exceptions/WrongCredentialsException";
import UserService from "../RepositoryServices/userRepositoryService";
import AuthenticationService from "./authentication.service";
import ChangePasswordDto from "./changePassword.dto";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import authMiddleware from "../middleware/auth.middleware";
import LoggedUser from "./loggedUser";
import {getManager} from "typeorm";
import BlackListedToken from "../Models/BlackListedTokenEntity/blackListedToken.entity";
import NotActiveException from "../Exceptions/NotActiveException";

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();
 public service = new AuthenticationService();
 public manager=getManager();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
      this.router.patch(`${this.path}/changePassword`, authMiddleware,validationMiddleware(ChangePasswordDto), this.changePaswordByLoggedUser);//optional allows users to change their password if are logged in
      this.router.get(`${this.path}/logout`, this.loggingOut)
  }

  private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const logInData: LogInDto = request.body;
    try{

    const loggedUser:LoggedUser=await this.service.login(logInData);

      if(loggedUser&&loggedUser.user.active){
//Set-Cookie'
        response.setHeader('Authorization', [this.service.createCookie(loggedUser.tokenData)]);
        response.send(loggedUser);
      }

    }
    catch (error) {
      next(error);

    }
  }
    private changePaswordByLoggedUser = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        const passwordData: ChangePasswordDto = request.body;
        const user=request.user;
        try{
            await this.service.changePasswordByLoggedUser(user,passwordData);
            response.send({
                status:200,
                message:"your password has been changed"
            });

        }
        catch (error) {
            next(error);

        }
    }

    private loggingOut = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
      const tokenToSaveAsBlackListed = request.header('Authorization');
      console.log(`token to save as blackListed= ${tokenToSaveAsBlackListed}`);
      try {
          const blackListedToken=await this.manager.save(BlackListedToken,new BlackListedToken(tokenToSaveAsBlackListed));
          response.send({
              status:200,
              messageToUser:"you are logged out"
          });
          console.log('log out message sended');
      } catch (error) {
          next(error);
      }

    }


}
export default AuthenticationController;
