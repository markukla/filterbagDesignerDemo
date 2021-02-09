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
        const records:Vocabulary[]=await this.repository.find();

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
        return savedRecord;

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

            const recordToUpdate = this.repository.create( {
                ...createVocabularyDto,
                id: Number(id)

            });
            const updatedRecord=await this.repository.save(recordToUpdate);

            return updatedRecord;


        }



    }
    public async deleteOneRecordById(id:string):Promise<DeleteResult>{
        const idOfExistingRecord:boolean=await this.findOneLanguageCodeById(id)!==null;
        if(idOfExistingRecord){
            const deleteResult:DeleteResult= await this.repository.delete(id);
            return deleteResult;
        }




    }

}
export default VocabularyService;
