const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');
const utils = require('util');
const puppeteer = require('puppeteer');
const hb = require('handlebars');
const readFile = utils.promisify(fs.readFile);

router.get('/', async (req, res) => {
   getTemplateHtml()
      .then(async (htmlT) => {
         console.log(htmlT);
         console.log('Compiling the template with handlebars');
         const template = hb.compile(htmlT, { strict: true });

         // const pdata = processData(rawData);
         const result = template(sampleData);
         const html = result;

         const browser = await puppeteer.launch();
         const page = await browser.newPage();
         await page.setContent(html);

         const path = './invoice.pdf';
         await page.pdf({
            path: path,
            format: 'A4',
            printBackground: true,
         });
         await browser.close();
         console.log('PDF Generated');
         res.download(path);
      })
      .catch((err) => {
         console.error(err);
      });
});

async function getTemplateHtml() {
   console.log('Loading template file in memory');
   try {
      const invoicePath = path.resolve('./index.html');
      return await readFile(invoicePath, 'utf8');
   } catch (err) {
      return Promise.reject('Could not load html template');
   }
}

const sampleData = {
   name: 'Solruf',
   country: 'India',
   owner: 'Sumit Agarwal',
   showImage: false,
   items: ['product 1', 'product 2', 'product 3'],
};

module.exports = router;

//  handlebar if else condition example
/* 
{{#if isActive}}
  <img src="star.gif" alt="Active">
{{else}}
  <img src="cry.gif" alt="Inactive">
{{/if}}
*/

//  handlebar loop example
/* 
 {{#each items}}
     <div id="companyDetails">
          <div>{{this}}</div>
     </div>
 {{/each}}

*/
