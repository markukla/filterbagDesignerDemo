import * as express from 'express';
import Controller from 'interfaces/controller.interface';
import CreateProductTopDto from "../Models/Products/createProductTop.dto";
import authMiddleware from "../middleware/auth.middleware";
import adminAuthorizationMiddleware from "../middleware/adminAuthorization.middleware";
import OrderForSapRepository from "../RepositoryServices/orderForSapRepository";
import OrderToExport from "../Models/Order/orderEntityExportMSSQL";
import OrderExportDto from "../Models/Order/orderExport.dto";
const path = require('path');
const puppeteer = require('puppeteer');


class OrderForSapController implements Controller {
    public path = '/api/SapOrders';
    public router = express.Router();
    public service: OrderForSapRepository = new OrderForSapRepository();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, authMiddleware, this.getAllRecords);
        this.router.get(`${this.path}/:id`, authMiddleware, this.getOneRecordById);
        this.router.post(this.path, authMiddleware,adminAuthorizationMiddleware, this.addOneRecord);


    }

    private addOneRecord = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const orderForSapData: OrderExportDto = request.body;
        const urlForPuppeter= `${process.env.API_URL_HOST_FOR_PUPPETER + process.env.PORT}?orderId=${orderForSapData.orderIdForPdf}&mode=Orderdrawing&languageCode=${orderForSapData.languageCodeForPdf}&email=${process.env.PuppeterEmail}&password=${process.env.PuppeterPassword}`   //this.router.url + `&languageCode=${this.authenticationService.selectedLanguageCode}`
       console.log(`urlForPuppeter=${urlForPuppeter}`);
        try {
            const orderForSAp: OrderToExport = await this.service.addOneRecord(orderForSapData);

           const pdf= await this.printPdf(urlForPuppeter);
            response.send({
                messageToUser: 'index data exported to SAP and Pdf genereted'
            });
        } catch (error) {
            next(error);
        }
    }
    printPdf = async (urlToPrint: string) => {
        const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage']});
        const page = await browser.newPage();




        // await page.goto(mainPageUrlTest, {waitUntil: 'networkidle0'});
        await Promise.all([
            page.goto(urlToPrint, {waitUntil: 'networkidle0'}),
            page.waitForNavigation({waitUntil: 'networkidle0'}),
        ]);

        const urlToSavePdf= path.join(__dirname,"/page.pdf");
        const urlTest= 'C:\\Users\\Marcin\\Desktop\\projekt_daniel\\TestEkksportuZapisuPdf\\test2.pdf';
        const pdf = await page.pdf({format: 'A4',path:urlTest});


        await browser.close();
        return pdf

    }



    private updateRecordById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const productTOp: CreateProductTopDto = request.body;
        const id: string = request.params.id;
        try {




        } catch (error) {
            next(error);
        }

    }

    private getAllRecords = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const records: OrderToExport[] = await this.service.findAllRecords();


            response.send(records);


        } catch (error) {
            next(error);
        }


    }

    private getOneRecordById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id: string = request.params.id;
        try {
            const foundRecord = await this.service.findOneOrder(id);
            if (foundRecord) {
                response.send(foundRecord)
            } else {

            }
        } catch (error) {
            next(error);
        }


    }







    private deleteOneById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id: string = request.params.id;
        try{

        }
        catch (error) {
            next(error);
        }


    }


}

export default OrderForSapController;
