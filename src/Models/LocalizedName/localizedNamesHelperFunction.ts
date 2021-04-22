import LocalizedName from "./localizedName.entity";


export const addIdsForCascadeUpdateLocalizedNames = (localizedNamesFromFront: LocalizedName[], localizedNamesFromDb: LocalizedName[]):LocalizedName[]=>{
    console.log(`localizedFromDb=${localizedNamesFromDb}`);
    localizedNamesFromFront.forEach((localizedFromFront)=>{
        localizedNamesFromDb.forEach((localizedInDb)=>{
            if(localizedInDb&&localizedNamesFromFront&&(localizedInDb.language.id == localizedFromFront.language.id)){
                console.log('in if');
                localizedFromFront.id = localizedInDb.id;
                console.log(`localizedFromFront.id=${localizedFromFront.id}`);
            }
        });
    });
    return localizedNamesFromFront

}
