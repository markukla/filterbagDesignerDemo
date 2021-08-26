import RepositoryService from "../interfaces/service.interface";
import {DeleteResult, getConnection, getRepository} from "typeorm";
import Material from "../Models/Materials/material.entity";
import MaterialNotFoundExceptionn from "../Exceptions/MaterialNotFoundException";
import CreateMaterialDto from "../Models/Materials/material.dto";
import MaterialAlreadyExistsException from "../Exceptions/MaterialAlreadyExistsException";
import VocabularyAlreadyExistException from "../Exceptions/vocabularyAlreadyExistException";
import VocabularyNotFoundException from "../Exceptions/vocabularyNotFoundException";
import Vocabulary from "../Models/Vocabulary/vocabulary.entity";
import CreateVocabularyDto from "../Models/Vocabulary/vocabulary.dto";
import DimensionCodeNotFoundException from "../Exceptions/DimensionCodeNotFoundException";
import {addIdsForCascadeUpdateLocalizedNames} from "../Models/LocalizedName/localizedNamesHelperFunction";

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

        /*const records:Vocabulary[]=await this.repository.find({softDeleteDate: null});

        return records;*/

        const records: Vocabulary[]= await getConnection().createQueryBuilder(Vocabulary,'vocabulary')


            .leftJoinAndSelect('vocabulary.localizedNames','vnames')
            .leftJoinAndSelect('vnames.language','vnameslanguage')
            .where('vocabulary.softDeleteDate is null')
            .getMany();
        return records

    }
     public async getNumberEqualIdPlus1():Promise<number> {

       const vocabularies: Vocabulary[]= await getRepository(Vocabulary)
           .createQueryBuilder("v")

           .orderBy('v.id',"ASC")
           .getMany();
       const numberPlus1= vocabularies[vocabularies.length -1].id+1;
       console.log(numberPlus1);
       return numberPlus1;

    }


    public async addOneRecord(createVocabularyDto:CreateVocabularyDto):Promise<Vocabulary>{
        const recordeWithThisNameInDatabase=await this.findOneVocabularyByVariableName(createVocabularyDto.variableName);

        if(recordeWithThisNameInDatabase){
            throw new VocabularyAlreadyExistException(createVocabularyDto.variableName);
        }

        const recordToSave ={
            ...createVocabularyDto,

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


            const localizedNamesWithIds= recordInDatabase.localizedNames;

            const recordToUpdate = {
                ...createVocabularyDto,
                localizedNames: addIdsForCascadeUpdateLocalizedNames(createVocabularyDto.localizedNames, localizedNamesWithIds),
                id:Number(id)
            }


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
