import RequestWithUser from "../interfaces/requestWithUser.interface";
import {NextFunction, Response} from "express";
import Role from "../Models/Role/role.entity";
import RoleEnum from "../Models/Role/role.enum";
import NoAdminPrivilligesException from "../Exceptions/NoAdminPrivilligesException";

 function setCORSAllowHeader(req: RequestWithUser, res: Response, next: NextFunction) {
     res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
     res.header(
         "Access-Control-Allow-Headers",
         "Origin, X-Requested-With, Content-Type, Accept"
     );
     next();

}
export default setCORSAllowHeader;
