import * as express from 'express';
import * as bodyParser from 'body-parser';

import Controller from "./interfaces/controller.interface";
import errorMiddleware from "./middleware/error.middleware";
import 'reflect-metadata';
import 'es6-shim';
import  'dotenv/config';
import * as cookieParser from "cookie-parser";
import * as fs from "fs";
import setCORSAllowHeader from "./middleware/addCORSOrginAccessHeader";
const multer = require("multer");

const path = require('path');
import * as cors from "cors";



class App {
    public app: express.Application;
    public port: number;

    constructor(controllers:Controller[]) {
        this.app = express();

       


        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }
    private connectToDatabase() {

    }
    public getServer() {
        return this.app;
    }




    private initializeMiddlewares() {
        this.app.use(cors());
        const publicDirectoryPath= path.join(__dirname, '/public');
        console.log(`publicDirectoryPath= ${publicDirectoryPath}`);
        this.app.use(express.static(publicDirectoryPath));
        this.app.use(express.static(process.cwd()+"/my-app/dist/projekt1FilterFront/"));
        /* process.cwd() -This method returns a string specifying the current working directory of the node.js process.*/
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'ejs');
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.get('/', (req:any,res:any) => {
            res.sendFile(process.cwd()+"/my-app/dist/projekt1FilterFront/index.html")
        });
        this.app.use(function(req:any, res:any, next:any) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });


    }

    private initializeControllers(controllers:Controller[]) {
        controllers.forEach(controller=>{
            this.app.use('/', controller.router);
        });




    }
    private initializeErrorHandling(){
        this.app.use(errorMiddleware);
    }





    public listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
        });
    }
}

export default App;
