import RepositoryService from "../interfaces/service.interface";
import {DeleteResult, getRepository} from "typeorm";
import Material from "../Models/Materials/material.entity";
import MaterialNotFoundExceptionn from "../Exceptions/MaterialNotFoundException";
import CreateMaterialDto from "../Models/Materials/material.dto";
import MaterialAlreadyExistsException from "../Exceptions/MaterialAlreadyExistsException";
import VocabularyAlreadyExistException from "../Exceptions/vocabularyAlreadyExistException";
import VocabularyNotFoundException from "../Exceptions/vocabularyNotFoundException";
import Vocabulary from "../Models/Vocabulary/vocabulary.entity";
import CreateVocabularyDto from "../Models/Vocabulary/vocabulary.dto";
import DimensionCodeNotFoundException from "../Exceptions/DimensionCodeNotFoundException";

class VocabularyService implements RepositoryService{

    public repository=getRepository(Vocabulary);

    public async findOneLanguageCodeById(id:string):Promise<Vocabulary>{
        const vocabulary:Vocabulary=await this.repository.findOne(id);
        if(!vocabulary){
            throw new VocabularyNotFoundException(id);
        }
        return vocabulary;


    }
    public async findOneVocabularyByVariableName(variableName:string):Promise<Vocabulary> {
        const foundVocabulary: Vocabulary = await this.repository.findOne({variableName: variableName});

        return foundVocabulary;

    }
    public async findAllRecords():Promise<Vocabulary[]>{
        const records:Vocabulary[]=await this.repository.find({softDeleteDate: null});

        return records;

    }


    public async addOneRecord(createVocabularyDto:CreateVocabularyDto):Promise<Vocabulary>{
        const recordeWithThisNameInDatabase=await this.findOneVocabularyByVariableName(createVocabularyDto.variableName);

        if(recordeWithThisNameInDatabase){
            throw new VocabularyAlreadyExistException(createVocabularyDto.variableName);
        }

        const recordToSave ={
            ...createVocabularyDto
        };
        const savedRecord=await this.repository.save(recordToSave);
        const recordToReturn = await this.repository.findOne(savedRecord.id); // dont use just the value of save functions cause it does not see eager relations, always use getByIdAfterSave

        return recordToReturn;

    }
    public async updateRecordById(id:string, createVocabularyDto:CreateVocabularyDto):Promise<Vocabulary>{
        const idOfExistingUser:boolean=await this.findOneLanguageCodeById(id)!==null;
        if(idOfExistingUser){
            const recordInDatabase=await this.findOneVocabularyByVariableName(createVocabularyDto.variableName);
            // do not allow to update if other material with this code or name already exist and throw exception

            if(recordInDatabase){
                if(recordInDatabase.id!==Number(id)){
                    throw new VocabularyAlreadyExistException(createVocabularyDto.variableName)
                }

            }

            const recordToUpdate = {
                ...recordInDatabase,
            }
            recordToUpdate.localizedNames.forEach((localizedInDB)=>{
                createVocabularyDto.localizedNames.forEach((localizedFromFront)=>{
                    console.log(`localizedFromFront.language.id=${localizedFromFront.language.id}`);
                    console.log(`localizedInDB.language.id=${localizedInDB.language.id}`);
                    if(localizedInDB.language.id == localizedFromFront.language.id){
                        console.log('in if');
                        localizedInDB.nameInThisLanguage = localizedFromFront.nameInThisLanguage;
                        console.log(`localizedInDB.nameInThisLanguage=${localizedInDB.nameInThisLanguage}`);
                    }
                });
            });
            recordToUpdate.variableName = createVocabularyDto.variableName;


            const updatedRecord=await this.repository.save(recordToUpdate);

            const recordToReturn = await this.repository.findOne(updatedRecord.id); // dont use just the value of save functions cause it does not see eager relations, always use getByIdAfterSave

            return recordToReturn;


        }



    }
    public async deleteOneRecordById(id:string):Promise<boolean>{
        let softDeletedRecord:Vocabulary;
        const recordToDelte = await this.findOneLanguageCodeById(id);
        const idOfExistingRecord:boolean=recordToDelte!==null;
        if(idOfExistingRecord){
            const recordTosoftDelete: Vocabulary = {
                ...recordToDelte,
                softDeleteDate: new Date()
            };
            softDeletedRecord= await this.repository.save(recordTosoftDelete);
        }
        else {
            throw new VocabularyNotFoundException(id);
        }
        if(softDeletedRecord&&softDeletedRecord.softDeleteDate) {
            return true;
        }
        else {
            return false;
        }
    }
}
export default VocabularyService;
