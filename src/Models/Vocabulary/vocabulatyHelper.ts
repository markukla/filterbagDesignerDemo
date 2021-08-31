import Vocabulary from "./vocabulary.entity";
import VocabularyService from "../../RepositoryServices/vocabularyRepositoryService";

export async function createAndReturnVocabularyWithSetVariabelName(name:string, dto:any): Promise<Vocabulary>{
    const vocabularyRepository = new VocabularyService();

    const newestId= await vocabularyRepository.getNumberEqualIdPlus1();
let vocabularyVariableName: string;
if(dto.materialCode){
    vocabularyVariableName= `${name}_${dto.materialCode}_id:${newestId}`
}
else if (dto.dimensionCode){
    vocabularyVariableName= `${name}_${dto.dimensionCode}_id:${newestId}`
}
else {
    vocabularyVariableName= `${name}_${dto.code}_id:${newestId}`
}

    const vocabularyInNewRecord= new Vocabulary(vocabularyVariableName, dto.localizedNames);
    return vocabularyInNewRecord;

}



