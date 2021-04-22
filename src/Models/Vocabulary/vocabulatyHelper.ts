import Vocabulary from "./vocabulary.entity";
import VocabularyService from "../../RepositoryServices/vocabularyRepositoryService";

export async function createAndReturnVocabularyWithSetVariabelName(name:string, dto:any): Promise<Vocabulary>{
    const vocabularyRepository = new VocabularyService();

    const newestId= await vocabularyRepository.getNumberEqualIdPlus1();

    const vocabularyVariableName= `${name}_${dto.code}_id:${newestId}`
    const vocabularyInNewRecord= new Vocabulary(vocabularyVariableName, dto.localizedNames);
    return vocabularyInNewRecord;

}



