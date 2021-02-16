import RepositoryService from "../interfaces/service.interface";
import {DeleteResult, getRepository} from "typeorm";
import Language from "../Models/Languages/language.entity";
import Vocabulary from "../Models/Vocabulary/vocabulary.entity";
import CreateVocabularyDto from "../Models/Vocabulary/vocabulary.dto";
import LanguageNotFoundException from "../Exceptions/LanguageNotFoundException";
import LanguageAlreadyExistException from "../Exceptions/LanguageAlreadyExistException";
import LanguageDto from "../Models/Languages/language.dto";
import DimensionCode from "../Models/DimesnionCodes/diemensionCode.entity";
import DimensionCodeNotFoundException from "../Exceptions/DimensionCodeNotFoundException";

class LanguageService implements RepositoryService{

    public repository=getRepository(Language);

    public async findOneById(id:string):Promise<Language>{
        const foundRecord =await this.repository.findOne(id);
        if(!foundRecord){
            throw new LanguageNotFoundException(id);
        }
        return foundRecord;


    }
    public async findOneLanguageByLanguageCode(languageCode:string):Promise<Language>{
        const foundRecords =await this.repository.findOne({languageCode:languageCode});
        return foundRecords;



    }


    public async findAllLanguages():Promise<Language[]>{
        const foundRecords =await this.repository.find({softDeleteDate: null});

        return foundRecords;

    }
    public async addOneLanguage(createLanguageDto: LanguageDto):Promise<Language>{
        const recordAlreadyExistInDatabase = await this.findOneLanguageByLanguageCode(createLanguageDto.languageCode)

        if(recordAlreadyExistInDatabase && recordAlreadyExistInDatabase.softDeleteDate === null){
            throw new LanguageAlreadyExistException(createLanguageDto.languageCode);
        }


        const recordToSave={
            ...createLanguageDto
        };
        const savedRecord=await this.repository.save(recordToSave);
        return savedRecord;

    }
    public async updateLanguageById(id:string, createLanguageDto:LanguageDto):Promise<Language>{
        const idOfExistingRecord:boolean=await this.findOneById(id)!==null;
        if(idOfExistingRecord){
            const recordWithThisCodeInDatabase= await this.findOneLanguageByLanguageCode(createLanguageDto.languageCode)
            // do not allow to update if other material with this code or name already exist and throw exception
            if(recordWithThisCodeInDatabase && recordWithThisCodeInDatabase.softDeleteDate === null){
                if(recordWithThisCodeInDatabase.id!==Number(id)){
                    throw new LanguageAlreadyExistException(createLanguageDto.languageCode);
                }
            }

            const recordToUpdate = this.repository.create( {
                ...createLanguageDto,
                id: Number(id)

            });
            const updatedRecord=await this.repository.save(recordToUpdate);

            return updatedRecord;


        }
        else {
            throw new LanguageNotFoundException(id);
        }
    }

    public async deleteOneById(id:string):Promise<boolean>{
        let softDeletedRecord:Language;
        const recordToDelte = await this.findOneById(id);
        const idOfExistingRecord:boolean=recordToDelte!==null;
        if(idOfExistingRecord){
            const recordTosoftDelete: Language = {
                ...recordToDelte,
                softDeleteDate: new Date()
            };
            softDeletedRecord= await this.repository.save(recordTosoftDelete);
        }
        else {
            throw new LanguageNotFoundException(id);
        }
        if(softDeletedRecord&&softDeletedRecord.softDeleteDate) {
            return true;
        }
        else {
            return false;
        }
    }


}
export default LanguageService;
