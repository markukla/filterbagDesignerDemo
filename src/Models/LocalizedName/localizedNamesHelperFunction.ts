import LocalizedName from "./localizedName.entity";


export const addIdsForCascadeUpdateLocalizedNames = (localizedNamesFromFront: LocalizedName[], localizedNamesFromDb: LocalizedName[]):LocalizedName[]=>{
    localizedNamesFromFront.forEach((localizedFromFront)=>{
        localizedNamesFromDb.forEach((localizedInDb)=>{
            if(localizedInDb.language.id == localizedFromFront.language.id){
                console.log('in if');
                localizedFromFront.id = localizedInDb.id;
                console.log(`localizedFromFront.id=${localizedFromFront.id}`);
            }
        });
    });
    return localizedNamesFromFront

}
