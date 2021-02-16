import Controller from "../interfaces/controller.interface";
import * as express from "express";
import VocabularyService from "../RepositoryServices/vocabularyRepositoryService";
import authMiddleware from "../middleware/auth.middleware";
import adminAuthorizationMiddleware from "../middleware/adminAuthorization.middleware";
import validationMiddleware from "../middleware/validation.middleware";
import CreateVocabularyDto from "../Models/Vocabulary/vocabulary.dto";
import Vocabulary from "../Models/Vocabulary/vocabulary.entity";
import LanguageService from "../RepositoryServices/languageRepositoryService";
import LanguageDto from "../Models/Languages/language.dto";
import Language from "../Models/Languages/language.entity";

class LanguageController implements Controller{
    public path = '/languages';
    public router = express.Router();
    public  service:LanguageService=new LanguageService();
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllLanguages);
        this.router.get(`${this.path}/:id`, this.getOneLanguageById);
        this.router.get(`${this.path}/codes/:code`,authMiddleware,adminAuthorizationMiddleware, this.languageWithThisCodeExists);
        this.router.patch(`${this.path}/:id`, authMiddleware,adminAuthorizationMiddleware, validationMiddleware(LanguageDto, true), this.updateLanguageCode);
        this.router.delete(`${this.path}/:id`,authMiddleware,adminAuthorizationMiddleware, this.deleteOneLanguageById);
        this.router.post(this.path, authMiddleware,adminAuthorizationMiddleware, validationMiddleware(LanguageDto), this.addOneLanguageCode);
        // this.router.get(`${this.path}/names/:name`,authMiddleware,adminAuthorizationMiddleware, this.materialWithThisNameExist);
    }
//findOneMaterialByCode
    private addOneLanguageCode = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const languageData: LanguageDto = request.body;
        try {
            const language = await this.service.addOneLanguage(languageData);
            response.send(
                language);
        } catch (error) {
            next(error);
        }
    }


    private updateLanguageCode = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const languageData: LanguageDto = request.body;
        const id:string=request.params.id;
        try {
            const updatedLanguage = await this.service.updateLanguageById(id, languageData);
            if(updatedLanguage){
                response.send(updatedLanguage)
            }

        }
        catch (error) {
            next(error);
        }

    }

    private getAllLanguages = async (request: express.Request, response: express.Response, next: express.NextFunction)=>
    {
        try{
            const languageCodes: Language[] = await this.service.findAllLanguages();

            response.send(languageCodes);
        }
        catch (error) {
            next(error);
        }
    }

    private getOneLanguageById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const id:string=request.params.id;
        try{
            const foundLanguage=await this.service.findOneById(id);
            if(foundLanguage){
                response.send(foundLanguage)
            }
        }
        catch (error) {
            next(error);
        }



    }
    private getOneLanguageByCode = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const code:string=request.params.code;
        try{
            const foundLanguage=await this.service.findOneLanguageByLanguageCode(code);
            if(foundLanguage){
                response.send(foundLanguage)
            }
        }
        catch (error) {
            next(error);
        }



    }
    private deleteOneLanguageById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const id:string=request.params.id;
        try{
            const deleTedResponse: boolean =await this.service.deleteOneById(id);

            response.send(deleTedResponse);
        }
        catch (error) {
            next(error);
        }

    }

    private languageWithThisCodeExists = async (request: express.Request, response: express.Response, next: express.NextFunction)=> {


        const code = request.params.code;
        let isTaken: boolean = false;
        try {
            const foundLanguageCode = await this.service.findOneLanguageByLanguageCode(code);
            if (foundLanguageCode) {
                isTaken = true;

            } else {
                isTaken = false;
            }
            response.send(isTaken);
        } catch (error) {
            next(error);
        }


    }




}

export default LanguageController;
