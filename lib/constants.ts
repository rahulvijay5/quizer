export const filesFormated = [
    {filename:'files/Test.json', name:'Test'},
    {filename:'files/DataTypesQuestions.json', name:'Data Types'},
    {filename:'files/DomainsQuestions.json', name:'Domain'},
    {filename:'files/GeneralOnDataObjectsEtc.json', name:'General on Data Objects'},
    {filename:'files/LockObjectQuestions.json', name:'Lock Object'},
    {filename:'files/QuestionBank.json', name:'Question Bank'},
    {filename:'files/SearchHelpQuestions.json', name:'Search Help'},
    {filename:'files/ViewsQuestions.json', name:'Views'},
  ].sort((a, b) => a.name.localeCompare(b.name))


 export const timePerQuestion = 45; // seconds per question