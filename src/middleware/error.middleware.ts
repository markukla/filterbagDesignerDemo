import HttpException from "../Exceptions/HttpException";
import {NextFunction, Request, Response} from "express";

function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
    const status: number = error.status || 500;
    const messageToUser='Ops something went wrong';
    response
        .status(status)
        .send({
            status: status,
            message: `${error.message}`,

        })
}

export default errorMiddleware;
