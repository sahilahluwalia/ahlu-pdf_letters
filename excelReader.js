import { createRequire } from "module";
const require = createRequire(import.meta.url);

const reader = require('xlsx')
const fs = require('fs')
const uuid = require('uuid')

const getFile = () => {
  const fileList = fs.readdirSync('./data', { withFileTypes: true })
    .filter(item => !item.isDirectory())
    .map(item => item.name)
  return './data/' + fileList[0]
}


function main() {
  const file = reader.readFile(getFile())

  const masterData = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[1]])


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


  fs.writeFile('people.json', JSON.stringify(PeopleObject), (err) => {
    if (err) {
      throw err
    }
    console.log("JSON data is saved.")
  })
}
main()

