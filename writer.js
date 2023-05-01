// Requiring module
const reader = require('xlsx')
// Reading our test file
const file = reader.readFile('./test.xlsx')
  
// Sample data set
let student_data = [{
    Student:'Nikhil',
    Age:22,
    Branch:'ISE',
    Marks: 70
},
{
    Student:'Amitha',
    Age:21,
    Branch:'EC',
    Marks:80
}]
var ws = reader.util.writeFileXLSX["Sheet3"];
// const ws = reader.utils.writeFileXLSX(student_data)
  
reader.utils.book_append_sheet(file,ws,"Sheet3")
  
// Writing to our file
reader.writeFile(file,'./test.xlsx')
