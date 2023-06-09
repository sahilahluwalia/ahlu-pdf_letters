import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require('fs')
const path = require('path')
const querystring = require('querystring');
// const baseURL='http://localhost:3000/pdf'
const baseURL='https://portal.ahluengineers.com/pdf'

const getOnlyIncomplete = (arrayToBeSearched)=>{
    return arrayToBeSearched.filter((item)=>{
        return item.isComplete==false
    })
}

// const testURL='http://localhost:3000/pdf?realID=6446a22e-c565-4c5f-8f11-b394ce94ca43&company=Swastik%20Engitech%20Private%20Limited&name=Mr.%20Prashant%20Bansal%20&id=T%2F0010&gender=Mr.&type=1&isComplete=false'

const completeOperation=async (id,arrayToBeSearched)=>{
    const objIndex = arrayToBeSearched.findIndex((obj => obj.realID == id));
    arrayToBeSearched[objIndex].isComplete = true
    console.log(arrayToBeSearched[objIndex].name+ ' of ',arrayToBeSearched[objIndex].company,' is completed')
    return arrayToBeSearched
}


const PDFMaker=async (arrayToBeSearched)=>{
    const browser = await puppeteer.launch({ 
        // executablePath: '/usr/bin/chromium-browser' ,
    headless:false
});
        const page = await browser.newPage();
        if(arrayToBeSearched.length==0){
            console.log('All PDFs are generated')
            await browser.close();
        }
    for(let i=0; i<arrayToBeSearched.length; i++){
        if(arrayToBeSearched[i].isComplete==true){
            console.log(arrayToBeSearched[i].name+ ' of ',arrayToBeSearched[i].company,' is already completed')
            continue
        }
        
        // console.log(arrayToBeSearched)
        const fileDirectory=`pdf/${arrayToBeSearched[i].type}/`
        if (!fs.existsSync(fileDirectory)){
            fs.mkdirSync(fileDirectory,{ recursive: true });
            console.log('Folder Created Successfully.');
        }
        const string=arrayToBeSearched[i].id
        // remove / from the string
        const stringAfterSlash=string.replace(/\//g, "-");

        const option = {
            format: 'A4',
            printBackground: true,
            // scale: 0.7,
            path: `pdf/${arrayToBeSearched[i].type}/${stringAfterSlash}_${arrayToBeSearched[i].name}.pdf`,
            // preferCSSPageSize: true
        }
        // console.log(baseURL+'?'+querystring.stringify(arrayToBeSearched[i]))
        await page.goto(baseURL+'?'+querystring.stringify(arrayToBeSearched[i]), {
            waitUntil:'networkidle2'
        });
        await page.pdf(option);
        // console.log(baseURL+'?'+querystring.stringify(arrayToBeSearched[i]))
            const modifiedArray=await completeOperation(arrayToBeSearched[i].realID,arrayToBeSearched)
            // console.log('array length is ',modifiedArray.length)
            saveProgress(modifiedArray)
        if(arrayToBeSearched.length==i+1){
            console.log('All PDFs are generated')
            await browser.close();
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
