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
  const masterData = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]])
  const PeopleObject = masterData.map((item) => {
    return {
      realID: uuid.v4(),
      company: item['Company Name '],
      name: item.Name,
      id: item['Reference No.'],
      gender: item['Mr. /Mrs.'],
      date: item.Date,
      designation: item.Post,
      type: item.Type,
      isComplete: false,
    }
  })
  console.log('first object is')
  console.log(PeopleObject[0])


  fs.writeFile('people.json', JSON.stringify(PeopleObject), (err) => {
    if (err) {
      throw err
    }
    console.log("JSON data is saved. Run next command")
  })
}
main()

