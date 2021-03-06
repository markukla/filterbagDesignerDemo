
import App from './app';
import 'dotenv/config';
import 'reflect-metadata';
import {createConnection} from 'typeorm';
import validateEnv from "./utils/vaildateEnv";
import UserController from "./Controllers/userController";
import RoleController from "./Controllers/roleController";
import AuthenticationController from "./authentication/authentication.controller";
import BusinessPartnerController from "./Controllers/businessPartnerController";
import {config, config_test} from "../ormconfig";
import {connectToDatabase} from "./utils/DatabaseUtil/manageDatabaseConnection";
import MaterialController from "./Controllers/materialController";
import ProductController from "./Controllers/productController";
import OrderController from "./Controllers/orderController";
import ProductTypeController from "./Controllers/productTypeController";
import ProductTopController from "./Controllers/productTopController";
import ProductBottomController from "./Controllers/productBottomController";
import DimensionCodeController from "./Controllers/dimensionCodeController";
import LanguageController from "./Controllers/languageController";
import VocabularyController from "./Controllers/vocabullaryController";
import OrderForSapController from "./Controllers/orderForSapController";
import BusinessPartnerFromSapController from "./Controllers/businessPartnerFromSapController";

validateEnv();


validateEnv();

(async () => {
    try {
        await connectToDatabase(config);
    } catch (error) {
        console.log('Error while connecting to the database', error);
        return error;
    }
    const app = new App(
        [
            new RoleController(),
            new AuthenticationController(),
            new UserController(),
            new BusinessPartnerController(),
            new MaterialController(),
            new ProductController(),
            new OrderController(),
            new ProductTypeController(),
            new ProductTopController(),
            new ProductBottomController(),
            new DimensionCodeController(),
            new LanguageController(),
            new VocabularyController(),
            new OrderForSapController(),
            new BusinessPartnerFromSapController()

        ],
    );
    app.listen();
})();
