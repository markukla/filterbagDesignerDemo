import RepositoryService from "../interfaces/service.interface";
import {DeleteResult, getRepository, UpdateResult} from "typeorm";
import Material from "../Models/Materials/material.entity";
import MaterialNotFoundExceptionn from "../Exceptions/MaterialNotFoundException";
import CreateMaterialDto from "../Models/Materials/material.dto";
import MaterialAlreadyExistsException from "../Exceptions/MaterialAlreadyExistsException";
import User from "../Models/Users/user.entity";
import DimensionCode from "../Models/DimesnionCodes/diemensionCode.entity";
import DimensionCodeNotFoundException from "../Exceptions/DimensionCodeNotFoundException";


class MaterialService implements RepositoryService {

    public repository = getRepository(Material);

    public async findOneMaterialById(id: string): Promise<Material> {
        const foundMaterial: Material = await this.repository.findOne(id);
        if (!foundMaterial) {
            throw new MaterialNotFoundExceptionn(id);
        }
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
        const foundMaterials: Material[] = await this.repository.find({softDeleteDate: null});

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

        const materialTosave: Material = {
            ...createMaterialDto
        };
        const savedMaterial = await this.repository.save(materialTosave);
        return savedMaterial;

    }

    public async updateMaterialById(id: string, createMaterialDto: CreateMaterialDto): Promise<Material> {
        const idOfExistingUser: boolean = await this.findOneMaterialById(id) !== null;
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
            const materialToSave = this.repository.create({
                ...createMaterialDto,
                id: Number(id)

            });
            const updatedMaterial = await this.repository.save(materialToSave);

            return updatedMaterial;


        }


    }

    public async deleteMaterialById(id: string): Promise<boolean> {
        let softDeletedRecord: Material;
        const recordToDelte = await this.findOneMaterialById(id);
        const idOfExistingRecord: boolean = recordToDelte !== null;
        if (idOfExistingRecord) {
            const recordTosoftDelete: Material = {
                ...recordToDelte,
                softDeleteDate: new Date()
            };
            softDeletedRecord = await this.repository.save(recordTosoftDelete);
        } else {
            throw new MaterialNotFoundExceptionn(id);
        }
        if (softDeletedRecord && softDeletedRecord.softDeleteDate) {
            return true;
        } else {
            return false;
        }
    }


}

export default MaterialService;
