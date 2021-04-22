import RepositoryService from "../interfaces/service.interface";
import {DeleteResult, getRepository} from "typeorm";
import Material from "../Models/Materials/material.entity";
import MaterialNotFoundExceptionn from "../Exceptions/MaterialNotFoundException";
import CreateMaterialDto from "../Models/Materials/material.dto";
import MaterialAlreadyExistsException from "../Exceptions/MaterialAlreadyExistsException";
import DimensionCode from "../Models/DimesnionCodes/diemensionCode.entity";
import DimensionCodeNotFoundException from "../Exceptions/DimensionCodeNotFoundException";
import LocalizedName from "../Models/LocalizedName/localizedName.entity";
import DimensionRoleEnum from "../Models/DimesnionCodes/dimensionRoleEnum";
import CreateDimensionCodeDto from "../Models/DimesnionCodes/createDimensionCode.dto";
import DimensionCodeAlreadyExistException from "../Exceptions/dimensionAlreadyExistException";
import {addIdsForCascadeUpdateLocalizedNames} from "../Models/LocalizedName/localizedNamesHelperFunction";
import Vocabulary from "../Models/Vocabulary/vocabulary.entity";
import {createAndReturnVocabularyWithSetVariabelName} from "../Models/Vocabulary/vocabulatyHelper";
import VocabularyService from "./vocabularyRepositoryService";

class DimensionCodeService implements RepositoryService{

    public repository=getRepository(DimensionCode);
    private vocabularyRepositoryService= new VocabularyService();

    public async findOneById(id:string):Promise<DimensionCode>{
        const foundRecord:DimensionCode=await this.repository.findOne(id);
        if(!foundRecord){
            throw new DimensionCodeNotFoundException(id);
        }
        return foundRecord;


    }
    public async findOneByDimensionCode(dimensionCode:string):Promise<DimensionCode>{
        const foundDimension:DimensionCode=await this.repository.findOne({dimensionCode:dimensionCode});
return foundDimension;



    }
    /*public async findOneByLocalizedName(localizedNames:LocalizedName[]):Promise<DimensionCode>{
        const foundMaterial:DimensionCode=await this.repository.findOne({localizedNames:localizedNames});
        return foundMaterial;


    }*/


    public async findAllDimensionCodes():Promise<DimensionCode[]>{
        const foundDiemnsionCodes:DimensionCode[] =await this.repository.find( {});

        return foundDiemnsionCodes;

    }
    public async findallFirstIndexDimensionCodes():Promise<DimensionCode[]>{
        const foundDiemnsionCodes:DimensionCode[] =await this.repository.find(
            {
                dimensionRole: DimensionRoleEnum.FIRSTINDEXDIMENSION,
            }
                );

        return foundDiemnsionCodes;

    }
    public async findallSecondIndexDimensionCodes():Promise<DimensionCode[]>{
        const foundDiemnsionCodes:DimensionCode[] =await this.repository.find({
            dimensionRole: DimensionRoleEnum.SECONDINDEXDIMENSION,
        });

        return foundDiemnsionCodes;

    }
    public async findallNoIndexRelatedDimensionCodes():Promise<DimensionCode[]>{
        const foundDiemnsionCodes:DimensionCode[] =await this.repository.find({
            dimensionRole: DimensionRoleEnum.NOINDEXDIMENSION,
            softDeleteDate: null
        });

        return foundDiemnsionCodes;

    }
    public async addOneDimensionCode(createDimensionDto:CreateDimensionCodeDto):Promise<DimensionCode>{
        const dimensionWithThisCodeInDatabase = await this.findOneByDimensionCode(createDimensionDto.dimensionCode)

        if(dimensionWithThisCodeInDatabase && dimensionWithThisCodeInDatabase.softDeleteDate === null){
            throw new DimensionCodeAlreadyExistException(createDimensionDto.dimensionCode);
        }


        const vocabularyInNewRecord= await createAndReturnVocabularyWithSetVariabelName("dimension",createDimensionDto);


        const recordToSave: DimensionCode = {
            ...createDimensionDto,
            vocabulary: vocabularyInNewRecord

        };
        const savedDimensionCOde=await this.repository.save(recordToSave);
        const recordToReturn = await this.repository.findOne(savedDimensionCOde.id); // dont use just the value of save functions cause it does not see eager relations, always use getByIdAfterSave

        return recordToReturn;


    }
    public async updateDimensionCodeById(id:string, createDimensionDto:CreateDimensionCodeDto):Promise<DimensionCode>{
        const recordInDatabase = await this.findOneById(id);
        const idOfExistingDimensionCode:boolean=recordInDatabase!==null;
        if(idOfExistingDimensionCode){
            const dimensionCodeWithThisCodeInDatabase= await this.findOneByDimensionCode(createDimensionDto.dimensionCode)
            // do not allow to update if other material with this code or name already exist and throw exception
            if(dimensionCodeWithThisCodeInDatabase && dimensionCodeWithThisCodeInDatabase.softDeleteDate === null){
                if(dimensionCodeWithThisCodeInDatabase.id!==Number(id)){
                    throw new DimensionCodeAlreadyExistException(createDimensionDto.dimensionCode);
                }
            }

            const localizedNamesWithIds= recordInDatabase.vocabulary.localizedNames;
            const vocabulary: Vocabulary= recordInDatabase.vocabulary;
            vocabulary.localizedNames=addIdsForCascadeUpdateLocalizedNames(createDimensionDto.localizedNames, localizedNamesWithIds);

            const recordToUpdate = {
                ...createDimensionDto,
                vocabulary: vocabulary,
                id:Number(id)
            }

            const updatedRecord=await this.repository.save(recordToUpdate);

            const recordToReturn = await this.repository.findOne(updatedRecord.id); // dont use just the value of save functions cause it does not see eager relations, always use getByIdAfterSave

            return recordToReturn;



        }



    }
    public async deleteOneById(id:string):Promise<boolean>{
        let softDeletedRecord:DimensionCode;
        let vocabularySuccesFullySoftDeleted: boolean;
        const recordToDelte = await this.findOneById(id);
        const idOfExistingRecord:boolean=recordToDelte!==null;
        if(idOfExistingRecord){
            const recordTosoftDelete: DimensionCode = {
                ...recordToDelte,
                softDeleteDate: new Date()
            };
             softDeletedRecord= await this.repository.save(recordTosoftDelete);
            vocabularySuccesFullySoftDeleted= await this.vocabularyRepositoryService.deleteOneRecordById(String(recordTosoftDelete.vocabulary.id));
        }
        else {
            throw new DimensionCodeNotFoundException(id);
        }
        if(softDeletedRecord&&softDeletedRecord.softDeleteDate && vocabularySuccesFullySoftDeleted) {
            return true;
        }
        else {
            return false;
        }
    }





}
export default DimensionCodeService;
