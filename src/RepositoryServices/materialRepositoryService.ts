import RepositoryService from "../interfaces/service.interface";
import {DeleteResult, getConnection, getRepository, UpdateResult} from "typeorm";
import Material from "../Models/Materials/material.entity";
import MaterialNotFoundExceptionn from "../Exceptions/MaterialNotFoundException";
import CreateMaterialDto from "../Models/Materials/material.dto";
import MaterialAlreadyExistsException from "../Exceptions/MaterialAlreadyExistsException";
import User from "../Models/Users/user.entity";
import DimensionCode from "../Models/DimesnionCodes/diemensionCode.entity";
import DimensionCodeNotFoundException from "../Exceptions/DimensionCodeNotFoundException";
import {addIdsForCascadeUpdateLocalizedNames} from "../Models/LocalizedName/localizedNamesHelperFunction";
import Vocabulary from "../Models/Vocabulary/vocabulary.entity";
import ProductTop from "../Models/Products/productTop.entity";
import {createAndReturnVocabularyWithSetVariabelName} from "../Models/Vocabulary/vocabulatyHelper";
import VocabularyService from "./vocabularyRepositoryService";
import Order from "../Models/Order/order.entity";


class MaterialService implements RepositoryService {

    public repository = getRepository(Material);
    private vocabularyRepositoryService= new VocabularyService();

    public async findOneMaterialById(id: string): Promise<Material> {

        /* const foundMaterial: Material = await this.repository.findOne(id);
        if (!foundMaterial) {
            throw new MaterialNotFoundExceptionn(id);
        }
        return foundMaterial;*/
        const foundMaterial: Material= await getConnection().createQueryBuilder(Material,'material')


            .leftJoinAndSelect('material.vocabulary','vMaterial')
            .leftJoinAndSelect('vMaterial.localizedNames','vMaterialnames')
            .leftJoinAndSelect('vMaterialnames.language','vMateriallanguage')
            .where("material.id = :id", {id:Number(id)})
            .getOne();
        return foundMaterial;


    }

    public async findOneMaterialByMaterialCode(materialCode: string): Promise<Material> {


         const foundMaterial: Material = await this.repository.findOne({
            materialCode: materialCode,
            softDeleteDate: null
        });
         return foundMaterial;



    }

    public async findOneMaterialByMaterialName(materialName: string): Promise<Material> {
        const foundMaterial: Material = await this.repository.findOne({
            materialName: materialName,
            softDeleteDate: null
        });
        return foundMaterial;


    }

    public async findAllMaterials(): Promise<Material[]> {

        /* const foundMaterials: Material[] = await this.repository.find({softDeleteDate: null});

        return foundMaterials;*/

        const foundMaterials: Material[]= await getConnection().createQueryBuilder(Material,'material')


            .leftJoinAndSelect('material.vocabulary','vMaterial')
            .leftJoinAndSelect('vMaterial.localizedNames','vMaterialnames')
            .leftJoinAndSelect('vMaterialnames.language','vMateriallanguage')
            .where('material.softDeleteDate is null')
            .getMany();
        return foundMaterials;

    }

    public async addOneMaterial(createMaterialDto: CreateMaterialDto): Promise<Material> {
        const materialWithThisCodeInDatabase = await this.findOneMaterialByMaterialCode(createMaterialDto.materialCode);
        const materialWithThisNameInDatabase = await this.findOneMaterialByMaterialName(createMaterialDto.materialName);

        if (materialWithThisCodeInDatabase && materialWithThisNameInDatabase) {
            throw new MaterialAlreadyExistsException(createMaterialDto.materialCode, createMaterialDto.materialName);
        } else if (materialWithThisCodeInDatabase) {
            throw new MaterialAlreadyExistsException(createMaterialDto.materialCode, null);
        } else if (materialWithThisNameInDatabase) {
            throw new MaterialAlreadyExistsException(null, createMaterialDto.materialName);
        }


        const vocabularyInNewRecord= await createAndReturnVocabularyWithSetVariabelName("material",createMaterialDto);

        const recordToSave: Material = {
            ...createMaterialDto,
            vocabulary: vocabularyInNewRecord

        };
        const savedMaterial = await this.repository.save(recordToSave);
        return savedMaterial;

    }

    public async updateMaterialById(id: string, createMaterialDto: CreateMaterialDto): Promise<Material> {
       const recordInDatabase=await this.findOneMaterialById(id);
        const idOfExistingUser: boolean = recordInDatabase !== null;
        if (idOfExistingUser) {
            const materialWithThisCodeInDatabase = await this.findOneMaterialByMaterialCode(createMaterialDto.materialCode);
            const materialWithThisNameInDatabase = await this.findOneMaterialByMaterialName(createMaterialDto.materialName);
            // do not allow to update if other material with this code or name already exist and throw exception
            if (materialWithThisCodeInDatabase && materialWithThisNameInDatabase) {
                if ((materialWithThisCodeInDatabase.id !== Number(id)) && (materialWithThisNameInDatabase.id !== Number(id))) {
                    throw new MaterialAlreadyExistsException(createMaterialDto.materialCode, createMaterialDto.materialName);
                }

            }
            if (materialWithThisCodeInDatabase) {
                if (materialWithThisCodeInDatabase.id !== Number(id)) {
                    throw new MaterialAlreadyExistsException(createMaterialDto.materialCode, null);
                }

            }
            if (materialWithThisNameInDatabase) {
                if (materialWithThisNameInDatabase.id !== Number(id)) {
                    throw new MaterialAlreadyExistsException(null, createMaterialDto.materialName);
                }

            }
            const localizedNamesWithIds= recordInDatabase.vocabulary.localizedNames;
            const vocabulary: Vocabulary= recordInDatabase.vocabulary;
            vocabulary.localizedNames=addIdsForCascadeUpdateLocalizedNames(createMaterialDto.localizedNames, localizedNamesWithIds);

            const recordToUpdate = {
                ...createMaterialDto,
                vocabulary: vocabulary,
                id:Number(id)
            }


            const updatedRecord=await this.repository.save(recordToUpdate);

            const recordToReturn = await this.findOneMaterialById(String(updatedRecord.id)); // dont use just the value of save functions cause it does not see eager relations, always use getByIdAfterSave

            return recordToReturn;


        }


    }

    public async deleteMaterialById(id: string): Promise<boolean> {
        let softDeletedRecord: Material;
        let vocabularySuccesFullySoftDeleted: boolean;
        const recordToDelte = await this.findOneMaterialById(id);
        const idOfExistingRecord: boolean = recordToDelte !== null;
        if (idOfExistingRecord) {
            const recordTosoftDelete: Material = {
                ...recordToDelte,
                softDeleteDate: new Date()
            };
            softDeletedRecord = await this.repository.save(recordTosoftDelete);
            vocabularySuccesFullySoftDeleted= await this.vocabularyRepositoryService.deleteOneRecordById(String(recordTosoftDelete.vocabulary.id));
        } else {
            throw new MaterialNotFoundExceptionn(id);
        }
        if (softDeletedRecord && softDeletedRecord.softDeleteDate && vocabularySuccesFullySoftDeleted) {
            return true;
        } else {
            return false;
        }
    }


}

export default MaterialService;
