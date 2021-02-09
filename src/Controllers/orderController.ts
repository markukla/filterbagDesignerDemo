import * as express from 'express';

import Controller from 'interfaces/controller.interface';

import validationMiddleware from "../middleware/validation.middleware";

import authMiddleware from "../middleware/auth.middleware";
import adminAuthorizationMiddleware from "../middleware/adminAuthorization.middleware";
import Material from "../Models/Materials/material.entity";
import CreateMaterialDto from "../Models/Materials/material.dto";
import MaterialNotFoundExceptionn from "../Exceptions/MaterialNotFoundException";
import Product from "../Models/Products/product.entity";
import ProductService from "../RepositoryServices/productRepositoryService";
import CreateProductDto from "../Models/Products/product.dto";
import ProductNotFoundExceptionn from "../Exceptions/ProductNotFoundException";
import * as multer from "multer";
import * as fs from "fs";
import OrderService from "../RepositoryServices/orderRepositoryService";
import CreateOrderDto from "../Models/Order/order.dto";
import Order from "../Models/Order/order.entity";
import {DeleteResult} from "typeorm";
import OrderVersionRegister from "../Models/OrderVersionRegister/orderVersionRegister.entity";
import OrderNotFoundException from "../Exceptions/OrderNotFoundException";
import NewestOrderNumber from "../Models/Order/newestOrderNumber";
const path = require('path');
const puppeteer = require('puppeteer');
const { DownloaderHelper } = require('node-downloader-helper');



class OrderController implements Controller {
    public path = '/orders';
    public router = express.Router();
    public service: OrderService = new OrderService();


    constructor() {
        this.initializeRoutes();
    }


    private initializeRoutes() {
        this.router.get(this.path, authMiddleware, this.getAllOrders);
        this.router.get(`${this.path}/currents`, authMiddleware, this.getAllCurentVersionOfOrders);
        this.router.post(this.path, authMiddleware, validationMiddleware(CreateOrderDto), this.addNewOrder)
        this.router.post(`${this.path}/currents/:id/newVersion`, authMiddleware, this.addNewVersionOfOrder);
        this.router.delete(`${this.path}/currents/:id`, this.removeCurrentOrderAndVersionRegister); // auth middleware removed to make puppeter work
        this.router.get(`${this.path}/currents/businessPartner/:partnerCode`, authMiddleware, this.findAllCurentVerionsOfOrderForGivenPartnerCode);
        this.router.get(`${this.path}/currents/businessPartner/:id`, authMiddleware, this.findAllCurentVerionsOfOrderForGivenPartneId);
        this.router.get(`${this.path}/:id`, authMiddleware, this.getOneOrderById);
        this.router.get(`${this.path}/orderVersionRegister/:id`, authMiddleware, this.findOrderVersionRegisterById);
        this.router.get(`${this.path}/orderNumber/newest`, authMiddleware,this.getOrderNumberForNewOrder);
        this.router.post(`${this.path}/drawing/save/pdf`, authMiddleware, this.usePuppetearToObtainDrawingPdf)

        //remeber to add authentication admin authorization middleware after tests


    }

    private addNewOrder = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

        const orderData: CreateOrderDto = req.body;
        console.log(orderData);


        try {
            const order: Order = await this.service.addNewOrder(orderData); // it is probably wrong path

            res.send(order);
        } catch (error) {
            console.log(`${error.message}`)
            next(error);
        }
    }
    private addNewVersionOfOrder = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

        const orderData: CreateOrderDto = req.body;


        try {
            const order: Order = await this.service.addNewVersionOfOrder(orderData, req.params.id); // it is probably wrong path

            res.send(order);
        } catch (error) {
            next(error);
        }
    }


    private getAllOrders = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const orders: Order[] = await this.service.findAllOrders();


            response.send(orders);


        } catch (error) {
            next(error);
        }


    }

    private getOneOrderById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id: string = request.params.id;
        try {
            const foundOrder: Order = await this.service.findOneOrderById(id);
            response.send(foundOrder);

        } catch (error) {
            next(error);
        }


    }


    private getAllCurentVersionOfOrders = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const orders: Order[] = await this.service.findAllCurentVerionsOfOrder();


            response.send(orders);


        } catch (error) {
            next(error);
        }


    }
    private removeCurrentOrderAndVersionRegister = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

        try {
            const curerntOrderid: string = request.params.id;
            const deletedOrderRegister: OrderVersionRegister = await this.service.deleteOrderVersionRegisterById(curerntOrderid);
            if (deletedOrderRegister) {
                response.send({
                    status: 200,
                    message: 'order and its version history removed'
                });
            } else {
                response.send({
                    status: 500,
                    message: 'Ops something went wrong, could not remove order'
                });
            }
        } catch (error) {
            next(error);
        }


    }


    private findAllCurentVerionsOfOrderForGivenPartnerCode = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
try{
        const partnerCode:string=request.params.partnerCode;
        console.log(`${partnerCode}`);

        const ordersforOnePartner:Order[]=await this.service.findAllCurentVerionsOfOrderForGivenPartnerCode(partnerCode);


        response.send(ordersforOnePartner);


    }
    catch (error) {
    next(error);
    }

    }


    private findAllCurentVerionsOfOrderForGivenPartneId = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try{
            const id:string=request.params.id;


            const ordersforOnePartner:Order[]=await this.service.findAllCurentVerionsOfOrderForGivenPartnerId(id);


            response.send(ordersforOnePartner);


        }
        catch (error) {
            next(error);
        }

    }

    private findOrderVersionRegisterById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try{
            const id:string=request.params.id;


            const orderVersionRegister:OrderVersionRegister=await this.service.findOrderVersionRegisterById(id);


            response.send(orderVersionRegister);


        }
        catch (error) {
            next(error);
        }

    }

    private getOrderNumberForNewOrder = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try{



            const newestOrderNumber: NewestOrderNumber=await this.service.obtainOrderNumberForNewOrder();


            response.send(newestOrderNumber);


        }
        catch (error) {
            next(error);
        }

    }
    private usePuppetearToObtainDrawingPdf = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const url = request.body.url
        console.log(`url to print= ${url}`);
        try {
            /*
            it work fine but saves file on server which is not necessary
            *  const browser = await puppeteer.launch({headless: true });
                        const page = await browser.newPage();
                        await page.goto(url, {waitUntil: 'networkidle2'});
                        const savedPdfUrl:string = path.join(__dirname,"/page.pdf");
                        const savedPNGURL= path.join(__dirname,"/page.png");
                        console.log(`savedPdfUrl= ${savedPdfUrl}`);
                        // await page.pdf({ format: 'A4', url:savedPdfUrl });
                        const pdf =await page.pdf({ path:savedPdfUrl, format:"A4" });
                        await page.screenshot({ path:savedPNGURL});
                        console.log('screen taken');
                        await browser.close();

                        response.download(savedPdfUrl, function (err) {
                            if (err) {
                                console.log("Error");
                                console.log(err);
                            } else {
                                console.log("Success");
                            }
                        });

                    }*/
            const pdf = await this.printPdf(url);
            response.set({'Content-Type': 'application/pdf', 'Content-Length': pdf.length})
            response.send(pdf);
        }catch (error) {
next(error);
        }

    }

     printPdf = async (urlToPrint: string) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(urlToPrint, {waitUntil: 'networkidle0'});
const pdf = await page.pdf({ format: 'A4' }); // does not save file on server but returns it to send to client

await browser.close();
return pdf

}
}



export default OrderController;
