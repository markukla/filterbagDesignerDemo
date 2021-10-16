
import {DeleteResult, EntityManager, getConnection, getManager, getRepository} from "typeorm";
import RepositoryService from "../interfaces/service.interface";
import User from "../Models/Users/user.entity";
import CreatePrivilegedUserDto from "../Models/Users/PrivilegedUsers/user.dto";
import UserWithThatEmailAlreadyExistsException from "../Exceptions/UserWithThatEmailAlreadyExistsException";

import * as bcrypt from "bcrypt";

import ChangePasswordDto from "../authentication/changePassword.dto";
import Role from "../Models/Role/role.entity";
import RoleEnum from "../Models/Role/role.enum";
import UpdatePrivilegedUserWithouTPasswordDto from "../Models/Users/PrivilegedUsers/modyfyUser.dto";
import validatePassword from "../utils/validatePassword/validate.password";
import UserNotFoundException from "../Exceptions/UserNotFoundException";
import CreateBusinessPartnerDto from "../Models/Users/BusinessPartner/businessPartner.dto";
import BusinessPartnerNotFoundException from "../Exceptions/BusinessPartnerNotFoundException";
import UpdateBussinessPartnerWithoutPassword from "../Models/Users/BusinessPartner/modyfyBusinessPartent.dto";
import UserWithThisEmailDoesNotExistException from "../Exceptions/UserWithThisEmailDoesNotExistException";
import WeekPasswordException from "../Exceptions/ToWeekPasswordException";
import PasswordValidationResult from "../utils/validatePassword/passwordValidationResult";
import PrivilligedUserNotFoundException from "../Exceptions/PrivilligedUserNotFoundException";
import ProductNotFoundExceptionn from "../Exceptions/ProductNotFoundException";
import CHangePasswordByAdminDto from "../Models/Users/changePasswordByAdmin.dto";
import BlockUserDto from "../Models/Users/blockUser.dto";
import Material from "../Models/Materials/material.entity";
import DimensionCodeNotFoundException from "../Exceptions/DimensionCodeNotFoundException";
import BusinessPartnerWithThisNameAndDiffrentCodeAlreadyExist from "../Exceptions/BusinessPartnerWithThisNameAndDiffrentCodeAlreadyExist";
import PartnerWithThisFullNameCodeAndCompanyNameAlreadyExistException from "../Exceptions/PartnerWithThisFullNameCodeAndCompanyNameAlreadyExistException";
import BusinessPartnerWithThisCodeAndDiffrentNameAlreadyExist
    from "../Exceptions/BuisnessPartnerWithThisCodeAndDiffrentNameAlreadyExists";
import Product from "../Models/Products/product.entity";

class UserService implements RepositoryService {

    public manager: EntityManager = getManager();
    public repository = getRepository(User);


    // In this app privileged users are admins and editors. Editor can be changed to admin and admin to editor


    public async findUserByEmail(email: string): Promise<User> {

        const foundUser = await getConnection().createQueryBuilder(User,'user')

            .leftJoinAndSelect('user.roles', 'roles')
            .where("user.softDeleteDate is null")
            .andWhere("user.email = :email", {email: email})
            .getOne();

        return foundUser;


    }

    public async findAllUsers(): Promise<User[]> {

        const foundUsers =  await getConnection().createQueryBuilder(User,'user')

            .leftJoinAndSelect('user.roles', 'roles')
            .where("user.softDeleteDate is null")
            .getMany();
        return foundUsers;


    }

    public async findUserById(id: string): Promise<User> {  // user here reference to all kind of users so business partners and privilliged users

        const foundUser = await getConnection().createQueryBuilder(User,'user')

            .leftJoinAndSelect('user.roles', 'roles')
            .where("user.id = :id", {id:Number(id)})
            .getOne();

        if (!foundUser) {
            throw new UserNotFoundException(id);
        }

        return foundUser;


    }


    public async registerPrivilegedUser(userData: CreatePrivilegedUserDto): Promise<User> {
        const userWithThisEmailInDatabase = await this.findUserByEmail(userData.email);
        if (userWithThisEmailInDatabase && userWithThisEmailInDatabase.softDeleteDate === null) {
            throw new UserWithThatEmailAlreadyExistsException(userData.email);
        }
        const validationResult: PasswordValidationResult = validatePassword(userData.password); // 

        let hashedPassword = null;
        if (validationResult.validatedPassword) { //
            hashedPassword = await bcrypt.hash(validationResult.validatedPassword, 10);
        } else {
            throw new WeekPasswordException(validationResult.foultList);
        }


        let createdRoles: Role[];
        if (userData.isAdmin) {
            createdRoles = [new Role(RoleEnum.ADMIN), new Role(RoleEnum.EDITOR)];
        } else {
            createdRoles = [new Role(RoleEnum.EDITOR)];
        }


        const user = {
            ...userData,
            roles: createdRoles,
            password: hashedPassword,

        };

        const savedUser = await this.manager.save(User, user);
        savedUser.password = undefined;

        return savedUser;
    }


    public getAllPrivilegedUsers = async (): Promise<User[]> => {
        // in relation option: it takes table name as paramter, not enity name

        const allUsers: User[] = await this.findAllUsers();

        const adminOrEditors: User[] = [];


        allUsers.forEach(user => {
            if (this.UserHasPartnerRole(user) === false && user.softDeleteDate === null && user.hidden===null) {
                adminOrEditors.push(user);
            }
        });


        return adminOrEditors;
    }
    public getAllAdmins = async (): Promise<User[]> => {
        // in relation option: it takes table name as paramter, not enity name

        const allUsers: User[] = await this.findAllUsers();

        const admins: User[] = [];


        allUsers.forEach(user => {
            if (this.UserHasAdminRole(user) === true && user.softDeleteDate === null && user.hidden === null) {
                admins.push(user);
            }
        });


        return admins;
    }
    public getAllEditors = async (): Promise<User[]> => {
        // in relation option: it takes table name as paramter, not enity name

        const allUsers: User[] = await this.findAllUsers();

        const editors: User[] = [];


        allUsers.forEach(user => {
            if (this.UserHasEditorRoleButIsNotAdmin(user) === true && user.softDeleteDate === null && user.hidden===null) {
                editors.push(user);
            }
        });


        return editors;
    }


    public findOnePrivilegedUserById = async (id: string): Promise<User> => {


        const foundUser: User = await this.findUserById(id)// relations it is not a table name, but field name, cause there could be many relations betwean 2 tables
        if (!foundUser) {
            throw new UserNotFoundException(String(id));
        } else if (foundUser) {
            if (!this.UserHasPartnerRole(foundUser)) {
                return foundUser;
            } else {
                throw new PrivilligedUserNotFoundException(String(id));
            }

        }


    }

    public updatePrivilegedUserWithoutPasssword = async (id: number, userData: UpdatePrivilegedUserWithouTPasswordDto): Promise<User> => {
        let privilligedUserToupdate: User = await this.findOnePrivilegedUserById(String(id));
        if (privilligedUserToupdate) {
            const userWithThisEmail: User = await this.findUserByEmail(userData.email);


            const otherUserWithThisEmailAlreadyExist: boolean = (userWithThisEmail && userWithThisEmail.id !== id);

            if (otherUserWithThisEmailAlreadyExist) {
                throw new UserWithThatEmailAlreadyExistsException(userData.email);
            }


            let createdRoles: Role[];
            if (userData.isAdmin) {
                createdRoles = [new Role(RoleEnum.ADMIN), new Role(RoleEnum.EDITOR)];
            } else {
                createdRoles = [new Role(RoleEnum.EDITOR)];
            }

            const user = {
                ...userData,
                roles: createdRoles,
                id: id
            };

            await this.manager.save(User, user);
            const updatedUser = await this.findOnePrivilegedUserById(String(id));
            updatedUser.password = undefined;

            return updatedUser;


        }


    }

    public deletePrivilegedUserById = async (id: number): Promise<boolean> => {
        const foundPriviligedUser = await this.findOnePrivilegedUserById(String(id));
        let softDeletedRecord: User;
        const recordToDelte = foundPriviligedUser;
        // dont allow to delete partners on user endpoint
        if (foundPriviligedUser) {
            const recordTosoftDelete: User = {
                ...recordToDelte,
                softDeleteDate: new Date()
            };
            softDeletedRecord = await this.repository.save(recordTosoftDelete);
        } else {
            throw new PrivilligedUserNotFoundException(String(id));
        }
        if (softDeletedRecord && softDeletedRecord.softDeleteDate) {
            return true;
        } else {
            return false;
        }
    }

    public changePrivilegedUserPasswordByAdmin = async (user: User, passwordData: CHangePasswordByAdminDto): Promise<User> => {
        const foundPrivilligedUser = await this.findOnePrivilegedUserById(String(user.id));
        if (foundPrivilligedUser) {

            const validationResult = validatePassword(passwordData.newPassword);


            if (validationResult.validatedPassword) { //
                let hashedPassword = await bcrypt.hash(validationResult.validatedPassword, 10);

                const userToUpdatePassword = this.manager.create(User, {
                    ...user,
                    password: hashedPassword

                });
                const updatedUser = await this.manager.save(User, userToUpdatePassword);
                return updatedUser;
            } else {
                throw new WeekPasswordException(validationResult.foultList);
            }


        }


    }
    public async findBusinessPartnerByCode (code: string): Promise<User> {
        const foundPartner= await this.repository.findOne({
            code: code,
            softDeleteDate: null
        });

        return foundPartner;
    }
    public async findBusinessPartnerByName (name: string): Promise<User> {
        const foundPartner= await this.repository.findOne({
            businesPartnerCompanyName: name,
            softDeleteDate: null
        });

        return foundPartner;
    }

    public async findBusinessPartnerByPartnerFullNameCompanyNameAndCode (fullName: string, companyName: string, code: string): Promise<User> {
        const foundPartner= await this.repository.findOne({
            fulName: fullName,
            businesPartnerCompanyName: companyName,
            code: code,
            softDeleteDate: null
        });

        return foundPartner;
    }
    public async findBusinessPartnerByCompanyName (companyName: string): Promise<User> {
        const foundPartner= await this.repository.findOne({
            businesPartnerCompanyName: companyName,
            softDeleteDate: null
        });

        return foundPartner;
    }


    // business partners are app users with lowest priviliges.
    public async registerBusinessPartner(businessPartnerdata: CreateBusinessPartnerDto): Promise<User> {
        const partnerWithThisEmailInDatabae = await this.findUserByEmail(businessPartnerdata.email)

        if (partnerWithThisEmailInDatabae) {
            throw new UserWithThatEmailAlreadyExistsException(businessPartnerdata.email);
        }
        const partnerWithThisFullNameCodeAndCompanyNameInDatabase= await this.findBusinessPartnerByPartnerFullNameCompanyNameAndCode(businessPartnerdata.fulName, businessPartnerdata.businesPartnerCompanyName, businessPartnerdata.code);
        if(partnerWithThisFullNameCodeAndCompanyNameInDatabase){
            throw new PartnerWithThisFullNameCodeAndCompanyNameAlreadyExistException(partnerWithThisFullNameCodeAndCompanyNameInDatabase.fulName, partnerWithThisFullNameCodeAndCompanyNameInDatabase.businesPartnerCompanyName, partnerWithThisFullNameCodeAndCompanyNameInDatabase.code);
        }
        const partnerWithThisCodeInDatabase= await this.findBusinessPartnerByCode(businessPartnerdata.code);

        if(partnerWithThisCodeInDatabase && partnerWithThisCodeInDatabase.businesPartnerCompanyName !== businessPartnerdata.businesPartnerCompanyName  ) {
            console.log('in throw if for the same code');

            throw new BusinessPartnerWithThisCodeAndDiffrentNameAlreadyExist(partnerWithThisCodeInDatabase.businesPartnerCompanyName);

        }
        const partnerWithThisNameInDatabase= await this.findBusinessPartnerByCompanyName(businessPartnerdata.businesPartnerCompanyName);
        if(partnerWithThisNameInDatabase && partnerWithThisNameInDatabase.code !== businessPartnerdata.code) {
            throw new BusinessPartnerWithThisNameAndDiffrentCodeAlreadyExist(partnerWithThisNameInDatabase.code);
        }
        const businesPartnerRoles: Role[] = [new Role(RoleEnum.PARTNER)];
        const validationResult: PasswordValidationResult = validatePassword(businessPartnerdata.password);
        if (validationResult.validatedPassword) {
            const hashedPassword = await bcrypt.hash(validationResult.validatedPassword, 10);
            const businesPartner = this.manager.create(User, {
                ...businessPartnerdata,
                roles: businesPartnerRoles,
                password: hashedPassword,

            });
            await this.manager.save(businesPartner);
            businesPartner.password = undefined;
            const businessPartnerToReturn= await this.findOnePartnerById(String(businesPartner.id));
            return businessPartnerToReturn;
        } else if (validationResult.foultList) {
            throw new WeekPasswordException(validationResult.foultList)
        }

    }


    public getAllBusinessPartners = async (): Promise<User[]> => {
        // in relation option: it takes table name as paramter, not enity name

        const allUsers: User[] = await this.findAllUsers();
        const businesPartners: User[] = [];

        allUsers.forEach(user => {
            if (this.UserHasPartnerRole(user) && user.softDeleteDate === null) // if user is business partner
            {
                businesPartners.push(user);
            }
        });
        return businesPartners;
    }

    public findOnePartnerById = async (id: string): Promise<User> => {


    //    const foundUser: User = await this.manager.findOne(User, id, {relations: ['roles', 'ordersOfPartner']});
        const foundUser: User = await this.findUserById(id);

        if (!foundUser) {
            throw new BusinessPartnerNotFoundException(String(id));
        }
        const foundUserIsPartner: boolean = this.UserHasPartnerRole(foundUser);
        if (foundUserIsPartner) {
            return foundUser;
        } else {
            throw new BusinessPartnerNotFoundException(String(id));
        }


    }

    public updatePartnerById = async (id: number, businessPartnerdata: UpdateBussinessPartnerWithoutPassword): Promise<User> => {
        let partnerToupdate: User = await this.findOnePartnerById(String(id));
        if (!partnerToupdate) {
            throw new BusinessPartnerNotFoundException(String(id));

        }
        const userWiththisIdIsBusinessPartner: boolean = this.UserHasPartnerRole(partnerToupdate);
        if (!userWiththisIdIsBusinessPartner) {
            throw new BusinessPartnerNotFoundException(String(id));
        }


        // dont allow to change email if email is asigned to other user or businessPartner, becasuse it make proper log in process imposssible
        const userWithThisEmail: User = await this.findUserByEmail(businessPartnerdata.email)
        if(userWithThisEmail) {
            const otherUserWithThisEmailAlreadyExist: boolean = (userWithThisEmail && userWithThisEmail.id !== id);
            if (otherUserWithThisEmailAlreadyExist) {
                throw new UserWithThatEmailAlreadyExistsException(businessPartnerdata.email);
            }
        }

        const partnerWithThisFullNameCodeAndCompanyNameInDatabase= await this.findBusinessPartnerByPartnerFullNameCompanyNameAndCode(businessPartnerdata.fulName, businessPartnerdata.businesPartnerCompanyName, businessPartnerdata.code);
        if(partnerWithThisFullNameCodeAndCompanyNameInDatabase && partnerWithThisFullNameCodeAndCompanyNameInDatabase.id !== id){
            throw new PartnerWithThisFullNameCodeAndCompanyNameAlreadyExistException(partnerWithThisFullNameCodeAndCompanyNameInDatabase.fulName, partnerWithThisFullNameCodeAndCompanyNameInDatabase.businesPartnerCompanyName, partnerWithThisFullNameCodeAndCompanyNameInDatabase.code);
        }
        /*
        commneted  out to allow to change companyName by admin if there is other record with the same code

const partnerWithThisCodeInDatabase= await this.findBusinessPartnerByCode(businessPartnerdata.code);

        if(partnerWithThisCodeInDatabase && partnerWithThisCodeInDatabase.id !==id && partnerWithThisCodeInDatabase.businesPartnerCompanyName !== businessPartnerdata.businesPartnerCompanyName  ) {
            console.log('in throw if for the same code');

            throw new BusinessPartnerWithThisCodeAndDiffrentNameAlreadyExist(partnerWithThisCodeInDatabase.businesPartnerCompanyName);

        }
        * */


        const partnerWithThisNameInDatabase= await this.findBusinessPartnerByCompanyName(businessPartnerdata.businesPartnerCompanyName);
        if(partnerWithThisNameInDatabase && partnerWithThisNameInDatabase.id !==id && partnerWithThisNameInDatabase.code !== businessPartnerdata.code) {
            throw new BusinessPartnerWithThisNameAndDiffrentCodeAlreadyExist(partnerWithThisNameInDatabase.code);
        }


        const businessPartner = this.manager.create(User, {
            ...businessPartnerdata,
            id: id

        });
        await this.manager.save(businessPartner);

        const updatedPartner = await this.findOnePartnerById(String(id));
        updatedPartner.password = undefined;
        return updatedPartner;

    }

    public deletePartnerById = async (id: number): Promise<boolean> => {
        const foundUser = await this.findOnePartnerById(String(id));
        let softDeletedRecord: User;
        const recordToDelte = foundUser;
        if (!this.UserHasPartnerRole(foundUser)) {
            throw new BusinessPartnerNotFoundException(String(id));
        }
        const recordTosoftDelete: User = {
            ...recordToDelte,
            softDeleteDate: new Date()
        };
        softDeletedRecord = await this.repository.save(recordTosoftDelete);
        if (softDeletedRecord && softDeletedRecord.softDeleteDate) {
            return true;
        } else {
            return false;
        }


    }

    public changePartnerPasswordByEditor = async (businessPartner: User, passwordData: CHangePasswordByAdminDto): Promise<User> => {
        const foundPartnerdUser = await this.findOnePartnerById(String(businessPartner.id));
        if (foundPartnerdUser) {

            const validationResult: PasswordValidationResult = validatePassword(passwordData.newPassword);


            if (validationResult.validatedPassword) { //
                let hashedPassword = await bcrypt.hash(validationResult.validatedPassword, 10);

                const businessPartnerToUpdatePassword = this.manager.create(User, {
                    ...businessPartner,
                    password: hashedPassword

                });
                const updatedPartner = await this.manager.save(User, businessPartnerToUpdatePassword);
                return updatedPartner;
            } else {
                throw new WeekPasswordException(validationResult.foultList);
            }


        }


    }

    public blockOrUnblockUser = async (user: User, activeStatusData: BlockUserDto): Promise<User> => {
        const foundUser = await this.findUserById(String(user.id));
        if (foundUser) {
            const active: boolean = activeStatusData.active;

            const userWithChangedActiveStatus = this.manager.create(User, {
                ...user,
                active: active

            });
            const updatedUser = await this.manager.save(User, userWithChangedActiveStatus);
            return updatedUser;
        }
    }


    public UserHasPartnerRole = (user: User): boolean => {
        let isPartner: boolean = false;

        user.roles.forEach(role => {
            if (role.rolename === RoleEnum.PARTNER) {
                isPartner = true;

            }
        });


        return isPartner;

    }
    public UserHasEditorRole = (user: User): boolean => {
        let isEditor: boolean = false;

        user.roles.forEach(role => {
            if (role.rolename === RoleEnum.EDITOR) {
                isEditor = true;

            }
        });


        return isEditor;

    }
    public UserHasAdminRole = (user: User): boolean => {
        let isAdmin: boolean = false;

        user.roles.forEach(role => {
            if (role.rolename === RoleEnum.ADMIN) {
                isAdmin = true;

            }
        });


        return isAdmin;

    }
    public UserHasEditorRoleButIsNotAdmin = (user: User): boolean => {
        let isEditorButNotAdmin: boolean = false;
        let isAdmin: boolean = false;
        let isEditor: boolean = false;
        user.roles.forEach(role => {
            if (role.rolename === RoleEnum.ADMIN) {
                isAdmin = true;

            }
            if (role.rolename === RoleEnum.EDITOR) {
                isEditor = true;

            }
        });
        if (isEditor && !isAdmin) {
            isEditorButNotAdmin = true;
        }


        return isEditorButNotAdmin;

    }


}

export default UserService;


