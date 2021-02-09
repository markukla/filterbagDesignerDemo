import 'reflect-metadata';
import 'es6-shim';
import  'dotenv/config';
import UsersExampleForTests from "../../tests/usersExampleForTests";
import User from "../../Models/Users/user.entity";
import Role from "../../Models/Role/role.entity";
import RoleEnum from "../../Models/Role/role.enum";
import {EntityManager, getManager, getRepository, Repository} from "typeorm";
import Material from "../../Models/Materials/material.entity";
import MaTerialsExamples from "../../tests/materialsExamplesForTests";
import Language from "../../Models/Languages/language.entity";
import {Languages} from "../../tests/languageExamplesForTest";
import DimensionCode from "../../Models/DimesnionCodes/diemensionCode.entity";
import {initialDimensionsForDatabase} from "../../tests/dimensionCodesForTests";



const usersExampleForTests:UsersExampleForTests=new UsersExampleForTests();
const users:User[]=[usersExampleForTests.activeAdminUserExample,usersExampleForTests.inactiveAdminUserExample,usersExampleForTests.activeEditorUserExample,usersExampleForTests.activePartnerUserExample,usersExampleForTests.inactivePartnerUserExample,usersExampleForTests.inactiveEditorUserExample];
const roles:Role[]=[new Role(RoleEnum.PARTNER),new Role(RoleEnum.EDITOR),new Role(RoleEnum.ADMIN)];

async function insertTestUsersToDatabase() {
    const manager=getManager();
    const usersInDatabse: User[] = await manager.find(User);
   // if(usersInDatabse.length ===0) {
        await manager.save(User,users);
        console.log("test users inserted to database")
   // }
}
async function insertRolesToDatabase(){

    const manager=getManager();
    const rolesInDatabase: Role [] = await manager.find(Role);
    if(rolesInDatabase.length === 0) {
        await manager.save(Role,roles);
        console.log("user roles inserted")
    }

}
async function insertTestMaterialsToDatabase(){

    const maTerialsExamples:MaTerialsExamples=new MaTerialsExamples();
    const materials:Material[]=maTerialsExamples.validMaterials;
    const repository=getRepository(Material);
    const materialsInDatabase: Material[] = await repository.find();
    if(materialsInDatabase.length ===0 ) {
        await repository.save(materials);
        console.log(" initial materials inserted")
    }

}
async function insertTestLanguagesToDatabase(){

    const languagesToSave:Language[] = Languages;
    const repository=getRepository(Language);
    const languagesInDatabase: Language[] = await repository.find();
    if(languagesInDatabase.length ===0 ) {
        await repository.save(languagesToSave);
        console.log("Initial languages inserted to databse")
    }

}
async function insertTestDimensionCodesToDatabase(){

    const dimensionCodesToSaveInDatabase:DimensionCode[] = initialDimensionsForDatabase;
    const repository=getRepository(DimensionCode);
    const dimensionCodesInDatabase: DimensionCode[] = await repository.find();
    if(dimensionCodesInDatabase.length ===0 ) {
        await repository.save(dimensionCodesToSaveInDatabase);
        console.log("Initial Dimension Codes inserted to databse")
    }

}
export{insertRolesToDatabase,insertTestUsersToDatabase,insertTestMaterialsToDatabase, insertTestLanguagesToDatabase, insertTestDimensionCodesToDatabase};
