import { createRequire } from "module";
const require = createRequire(import.meta.url);


const fs = require('fs')
const path = require('path')
const querystring = require('querystring');
// const baseURL='http://localhost:3000/pdf'
const baseURL='https://portal.ahluengineers.com/pdf'

// const typeDetecter =(type)=>{
//     // console.log(type)
//     switch (type) {
//         case 1:
//         return baseURL+'/one/'
//         case 2:
//         return baseURL+'/two/'
//         case 3:
//         return baseURL+'/three/'
//         case 4:
//         return baseURL+'/four/'
//         case 5:
//         return baseURL+'/five/'
//         default:
//         return baseURL+'/six/'
// }
// }

const getOnlyIncomplete = (arrayToBeSearched)=>{
    return arrayToBeSearched.filter((item)=>{
        return item.isComplete==false
    }
    )
}

const testURL='http://localhost:3000/pdf?realID=6446a22e-c565-4c5f-8f11-b394ce94ca43&company=Swastik%20Engitech%20Private%20Limited&name=Mr.%20Prashant%20Bansal%20&id=T%2F0010&gender=Mr.&type=1&isComplete=false'

const completeOperation=async (id,arrayToBeSearched)=>{
    const objIndex = arrayToBeSearched.findIndex((obj => obj.realID == id));
    arrayToBeSearched[objIndex].isComplete = true
    console.log(arrayToBeSearched[objIndex].name+ ' of ',arrayToBeSearched[objIndex].company,' is completed')
    // console.log(arrayToBeSearched)
    return arrayToBeSearched
}


const PDFMaker=async (arrayToBeSearched)=>{
    const browser = await puppeteer.launch({ 
        // executablePath: '/usr/bin/chromium-browser' ,
    headless:false

});
        const page = await browser.newPage();
        
    for(let i=0; i<arrayToBeSearched.length; i++){
        // console.log(arrayToBeSearched)
        const fileDirectory=`pdf/${arrayToBeSearched[i].type}/`
        console.log(fileDirectory)
        console.log(fs.existsSync(fileDirectory))
        if (!fs.existsSync(fileDirectory)){
            fs.mkdirSync(fileDirectory,{ recursive: true });
            console.log('inside')
            console.log('Folder Created Successfully.');
        }
        console.log('after')
        const option = {
            format: 'A4',
            printBackground: true,
            // scale: 0.7,
            path: `pdf/${arrayToBeSearched[i].type}/${arrayToBeSearched[i].name}.pdf`,
            // preferCSSPageSize: true
        }
        await page.goto(baseURL+'?'+querystring.stringify(arrayToBeSearched[i]), {
            waitUntil:'networkidle2'
        });
        await page.pdf(option);
        // console.log(baseURL+'?'+querystring.stringify(arrayToBeSearched[i]))
        if(Math.random()>0.5){
            const modifiedArray=await completeOperation(arrayToBeSearched[i].realID,arrayToBeSearched)
            // console.log('array length is ',modifiedArray.length)
            saveProgress(modifiedArray)
        } else {
        }
    }
  
}

const saveProgress=(completedObject)=>{
    // console.log(completedObject)
    fs.writeFileSync('people.json', JSON.stringify(completedObject), (err) => {
        if (err) {
            throw err
        }
        console.log("JSON data is saved.")

    })
}

const getDatafromDisk = ()=>{
const people = fs.readFileSync('people.json', 'utf-8')
return people
}
import puppeteer from 'puppeteer';
function main(){
    const people=getDatafromDisk()
const peopleObject = JSON.parse(people)
    const arrayToBeSearched = getOnlyIncomplete(peopleObject)
    PDFMaker(arrayToBeSearched) 
    
}
main()

// (async () => {
//     const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium-browser' ,
// headless:false});
//     const page = await browser.newPage();
  
//     await page.goto('https://developer.chrome.com/');
  
//     // Set screen size
//     await page.setViewport({width: 1080, height: 1024});
  
//     // Type into search box
//     await page.type('.search-box__input', 'automate beyond recorder');
  
//     // Wait and click on first result
//     const searchResultSelector = '.search-box__link';
//     await page.waitForSelector(searchResultSelector);
//     await page.click(searchResultSelector);
  
//     // Locate the full title with a unique string
//     const textSelector = await page.waitForSelector(
//       'text/Customize and automate'
//     );
//     const fullTitle = await textSelector.evaluate(el => el.textContent);
  
//     // Print the full title
//     console.log('The title of this blog post is "%s".', fullTitle);
  
//     await browser.close();
//   })();
