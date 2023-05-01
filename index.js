import { createRequire } from "module";
const require = createRequire(import.meta.url);

const reader = require('xlsx')
const fs = require('fs')
const uuid =require('uuid')


function main(){
// Reading our test file
const file = reader.readFile('./Master_Records_22thApril23_Sayali_F_checked (2).xlsx')
let data = []
  
const sheets = file.SheetNames
  
const masterData =reader.utils.sheet_to_json(file.Sheets[file.SheetNames[1]])


// console.log(masterData[0])

const PeopleObject = masterData.map((item) => {
   return {
    realID: uuid.v4(),
      company: item['Company name'],
     name: item['Contact Name'],
    id: item['Identification Number '],
    gender: item.Gender,
    name: item['Person Name'],
     designation: item['Designation'],
     type: item.Type,
     isComplete: false,
   }
})
console.log(PeopleObject[0])


fs.writeFile('people.json', JSON.stringify(PeopleObject), (err) => {
    if (err) {
        throw err
    }
    console.log("JSON data is saved.")
})
}
main()
// console.log(PeopleObject[0])

