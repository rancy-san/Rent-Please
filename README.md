
# Rent, Please!

  

Rent, Please! is a data gathering tool that obtains data from a popular property rental web application, PadMapper. and generates a report to display the current standing of the Canadian rental market for one or multiple given districts. The reports can be used to extrapolate data as they are delivered in a raw format through a Comma Separated Value (CSV) file.

The application currently supports CSV file outputs and automated PadMapper data-crawling. Future updates will support other data science file formats such as .arff, and data crawling of other rental applications will be supported in the future as well.

  

## Setup

### Installation
Download NodeJS.
Install all modules required through Command Line Interface (CLI):  `npm install`
<br>

### Version

##### NodeJS v15.6.0
##### NPM v7.4.0
##### cors@2.8.5
##### exceljs@4.2.1
##### express@4.17.1 
##### os@0.1.1
##### puppeteer@9.1.1
##### tsc@1.20150623.0
##### typescript@4.2.4
<br>

### Compiling
Compiling the TypeScript files to JavaScript files is a must for running the application. Using the `tsc` command will produce '.js' files which is required for the application to run.

####  /server/src/ts
In a CLI navigate to the **/server/src/ts** folder and run the `tsc` command to compile all TypeScript files to JavaScript.
Example: `tsc`

####  /client/src/ts
In a CLI navigate to the /client/src/ts folder and run the `tsc` command to output the compiled JavaScript file into the **/client/src/js** folder. 
Example:  `tsc --watch --out ../js/main.js main.ts`
<br>

### Running
In a CLI navigate to the **/server/src/ts** folder and run main.js using Node and the 'start' argument
Example: `node main start`

## Usage
#### Server
After performing the 'Setup' phase above, in a CLI navigate to the **/server/src/ts** folder run:  `node main start`

#### Client
