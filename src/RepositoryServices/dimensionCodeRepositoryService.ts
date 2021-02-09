import RepositoryService from "../interfaces/service.interface";
import {DeleteResult, getRepository} from "typeorm";
import Material from "../Models/Materials/material.entity";
import MaterialNotFoundExceptionn from "../Exceptions/MaterialNotFoundException";
import CreateMaterialDto from "../Models/Materials/material.dto";
import MaterialAlreadyExistsException from "../Exceptions/MaterialAlreadyExistsException";
import DimensionCode from "../Models/DimesnionCodes/diemensionCode.entity";
import DimensionCodeNotFoundException from "../Exceptions/DimensionCodeNotFoundException";
import LocalizedName from "../Models/DimesnionCodes/localizedName";
import DimensionRoleEnum from "../Models/DimesnionCodes/dimensionRoleEnum";
import CreateDimensionCodeDto from "../Models/DimesnionCodes/createDimensionCode.dto";
import DimensionCodeAlreadyExistException from "../Exceptions/dimensionAlreadyExistException";

class DimensionCodeService implements RepositoryService{

    public repository=getRepository(DimensionCode);

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
    public async findOneByLocalizedName(localizedNames:LocalizedName[]):Promise<DimensionCode>{
        const foundMaterial:DimensionCode=await this.repository.findOne({localizedDimensionNames:localizedNames});
        return foundMaterial;


    }

    public async findAllDimensionCodes():Promise<DimensionCode[]>{
        const foundDiemnsionCodes:DimensionCode[] =await this.repository.find();

        return foundDiemnsionCodes;

    }
    public async findallFirstIndexDimensionCodes():Promise<DimensionCode[]>{
        const foundDiemnsionCodes:DimensionCode[] =await this.repository.find({dimensionRole: DimensionRoleEnum.FIRSTINDEXDIMENSION});

        return foundDiemnsionCodes;

    }
    public async findallSecondIndexDimensionCodes():Promise<DimensionCode[]>{
        const foundDiemnsionCodes:DimensionCode[] =await this.repository.find({dimensionRole: DimensionRoleEnum.SECONDINDEXDIMENSION});

        return foundDiemnsionCodes;

    }
    public async findallNoIndexRelatedDimensionCodes():Promise<DimensionCode[]>{
        const foundDiemnsionCodes:DimensionCode[] =await this.repository.find({dimensionRole: DimensionRoleEnum.NOINDEXDIMENSION});

        return foundDiemnsionCodes;

    }
    public async addOneDimensionCode(createDimensionDto:CreateDimensionCodeDto):Promise<DimensionCode>{
        const dimensionWithThisCodeInDatabase = await this.findOneByDimensionCode(createDimensionDto.dimensionCode)

        if(dimensionWithThisCodeInDatabase){
            throw new DimensionCodeAlreadyExistException(createDimensionDto.dimensionCode);
        }


        const dimensionCodeToSave:DimensionCode={
            ...createDimensionDto
        };
        const savedDimensionCOde=await this.repository.save(dimensionCodeToSave);
        return savedDimensionCOde;

    }
    public async updateDimensionCodeById(id:string, createDimensionDto:CreateDimensionCodeDto):Promise<DimensionCode>{
        const idOfExistingDimensionCode:boolean=await this.findOneById(id)!==null;
        if(idOfExistingDimensionCode){
            const dimensionCodeWithThisCodeInDatabase= await this.findOneByDimensionCode(createDimensionDto.dimensionCode)
            // do not allow to update if other material with this code or name already exist and throw exception
            if(dimensionCodeWithThisCodeInDatabase){
                if(dimensionCodeWithThisCodeInDatabase.id!==Number(id)){
                    throw new DimensionCodeAlreadyExistException(createDimensionDto.dimensionCode);
                }
            }

            const dimensionTosave = this.repository.create( {
                ...createDimensionDto,
                id: Number(id)

            });
            const updatedDimensionCode=await this.repository.save(dimensionTosave);

            return updatedDimensionCode;


        }



    }
    public async deleteOneById(id:string):Promise<DeleteResult>{
        const idOfExistingDimensionCode:boolean=await this.findOneById(id)!==null;
        if(idOfExistingDimensionCode){
            const deleteResult:DeleteResult= await this.repository.delete(id);
            return deleteResult;
        }
        else {
            throw new DimensionCodeNotFoundException(id);
        }




    }





}
export default DimensionCodeService;
