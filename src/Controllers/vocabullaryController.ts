import Controller from "../interfaces/controller.interface";
import * as express from "express";
import DimensionCodeService from "../RepositoryServices/dimensionCodeRepositoryService";
import authMiddleware from "../middleware/auth.middleware";
import adminAuthorizationMiddleware from "../middleware/adminAuthorization.middleware";
import validationMiddleware from "../middleware/validation.middleware";
import CreateDimensionCodeDto from "../Models/DimesnionCodes/createDimensionCode.dto";
import DimensionCode from "../Models/DimesnionCodes/diemensionCode.entity";
import VocabularyService from "../RepositoryServices/vocabularyRepositoryService";
import CreateVocabularyDto from "../Models/Vocabulary/vocabulary.dto";
import Vocabulary from "../Models/Vocabulary/vocabulary.entity";

class VocabularyController implements Controller{
    public path = '/vocabularies';
    public router = express.Router();
    public  service:VocabularyService=new VocabularyService();
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllVocabularies);
        this.router.get(`${this.path}/:id`, authMiddleware, this.getOneVocabularyById);
        this.router.get(`${this.path}/variableNames/:name`,authMiddleware,adminAuthorizationMiddleware, this.findVocabularyByVariableName);
        this.router.patch(`${this.path}/:id`, authMiddleware,adminAuthorizationMiddleware, validationMiddleware(CreateVocabularyDto, true), this.updateVocabulary);
        this.router.delete(`${this.path}/:id`,authMiddleware,adminAuthorizationMiddleware, this.deleteOneVocabularyById);
        this.router.post(this.path, authMiddleware,adminAuthorizationMiddleware, validationMiddleware(CreateVocabularyDto), this.addOneVocabulary);
        // this.router.get(`${this.path}/names/:name`,authMiddleware,adminAuthorizationMiddleware, this.materialWithThisNameExist);
    }
//findOneMaterialByCode
    private addOneVocabulary = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const vocabulary: CreateVocabularyDto = request.body;
        try {
            const languageCode:Vocabulary = await this.service.addOneRecord(vocabulary);
            response.send(
                vocabulary);
        } catch (error) {
            next(error);
        }
    }


    private updateVocabulary = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const vocabularyData: CreateVocabularyDto = request.body;
        const id:string=request.params.id;
        try {
            const updatedLanguageCOde = await this.service.updateRecordById(id, vocabularyData);
            if(updatedLanguageCOde){
                response.send(updatedLanguageCOde)
            }

        }
        catch (error) {
            next(error);
        }

    }

    private getAllVocabularies = async (request: express.Request, response: express.Response, next: express.NextFunction)=>
    {
        try{
            const vocabularies:Vocabulary[]=await this.service.findAllRecords();

            response.send(vocabularies);
        }
        catch (error) {
            next(error);
        }
    }

    private getOneVocabularyById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const id:string=request.params.id;
        try{
            const foundVocabulary=await this.service.findOneLanguageCodeById(id);
            if(foundVocabulary){
                response.send(foundVocabulary)
            }
        }
        catch (error) {
            next(error);
        }



    }
    private getOneVocabularyByVariableName = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const code:string=request.params.code;
        try{
            const foundVocabulary=await this.service.findOneLanguageCodeById(code);
            if(foundVocabulary){
                response.send(foundVocabulary)
            }
        }
        catch (error) {
            next(error);
        }



    }
    private deleteOneVocabularyById = async (request: express.Request, response: express.Response, next: express.NextFunction)=>{
        const id:string=request.params.id;
        try{
            const deleTedResponse=await this.service.deleteOneRecordById(id);
            if(deleTedResponse.affected===1){
                response.send({
                    status:200,
                    message:`languageCode with id= ${id} has beeen removed`
                })
            }

        }
        catch (error) {
            next(error);
        }

    }

    private findVocabularyByVariableName = async (request: express.Request, response: express.Response, next: express.NextFunction)=> {


        const code = request.params.code;
        try {
            const foundVocabulary = await this.service.findOneVocabularyByVariableName(code);
            response.send(foundVocabulary);
        } catch (error) {
            next(error);
        }


    }




}

export default VocabularyController;
