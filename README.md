
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
<br>

## Usage
### Server / Backend
After performing the 'Setup' phase above, in a CLI navigate to the **/server/src/ts** folder run:  `node main start`
Example of server running: 
![Server side startup](https://user-images.githubusercontent.com/70251413/121634359-3ec55b00-ca39-11eb-816f-3b16cedbd4e9.png)

<br>

### Client / Frontend
Open 'districtSelection.html' within a web browser such as Google Chrome, Firefox, Microsoft Edge, etc.
Example of application startup defaulted to Victoria:
![Client side startup default view](https://user-images.githubusercontent.com/70251413/121703748-fe40fe00-ca87-11eb-8860-45bdb04418d8.PNG)
<br>

#### Searching for a custom location
Search for a custom location by dragging the map around.  Dragging the map around will change the value of the longitude and latitude to match the current map's location. Updates to the longitude and latitude values are reflected both on the map and on the "Custom District" item.
Example of dragging around the map and renaming the location name to Esquimalt:
![Dragged custom location, and renamed custom location](https://user-images.githubusercontent.com/70251413/121708120-17e44480-ca8c-11eb-91a2-2655ae0204f5.PNG)

#### Searching for a known location
Another way of searching for a location is by typing the name of the location in the search bar and clicking on the magnifying glass.
Example of searching for Vancouver:
![List of locations using "Vancouver" as the search term](https://user-images.githubusercontent.com/70251413/121709461-6e05b780-ca8d-11eb-9041-8e259ebc8847.PNG)

To pan the map on one of the known locations, click on the geolocate button.
Example of the 'Geolocate' button for a known location:
![Geolocate button for a known location](https://user-images.githubusercontent.com/70251413/121710142-229fd900-ca8e-11eb-869f-21e068ff0242.PNG)
Example of the map panned to the known location:
![Example of known location for Vancouver through the search bar](https://user-images.githubusercontent.com/70251413/121713356-9f808200-ca91-11eb-9b96-0b380a189db0.PNG)
<br>

#### Adding one or more location(s) to the 'Prepare Data' list to be part of generating a document
After searching for a custom or known location, click on the add button.
Example of the 'Add' button and clicking on it to be part of generating a document:
![Add button for Saanich](https://user-images.githubusercontent.com/70251413/121717940-9ba32e80-ca96-11eb-92fd-74e9340602b2.png)
![Add button for Esquimalt](https://user-images.githubusercontent.com/70251413/121719333-b924c800-ca97-11eb-8621-baccccc1cd69.png)
![Add button for Victoria Downtown](https://user-images.githubusercontent.com/70251413/121717942-9c3bc500-ca96-11eb-9c25-5081412e86cd.png)
To view the list of added locations, click on the 'Prepare Data' tab
![List of locations in the Prepare Data list](https://user-images.githubusercontent.com/70251413/121716971-8974c080-ca95-11eb-88fb-ed92bd7537fe.PNG)
<br>

#### Removing one or more location(s) from the 'Prepare Data' list to not be part of generating a document
To remove a location from the 'Prepare Data' list, click on the remove button.
Example of the 'Remove' icon:
![Remove button](https://user-images.githubusercontent.com/70251413/121718800-8c70b080-ca97-11eb-82ad-4dbc949d22cd.png)
<br>

#### Request a document to be generated
To generate a document for properties located for each of the districts in the 'Prepare Data' list, click on the 'Generate Report' button. Note: the 'Generate Report' button only appears if the 'Prepare Data' is not empty.
Example of the 'Generate Report' button:
![Generate Report button](https://user-images.githubusercontent.com/70251413/121721979-b5924080-ca99-11eb-9311-dc2e71052ce8.png)

Example of waiting for the server to finishing processing:
![Loading screen while waiting for the report to be generated](https://user-images.githubusercontent.com/70251413/121722811-a495ff00-ca9a-11eb-8dc5-15aa86fdc667.png)

Automatically when the server has completed processing the request, a download will be initiated by the application. Depending on the browser the file format/extension of the generated report will be convert from CSV to an XLS file.
Example of the XLS report downloaded after the server has completed the request:
![Downloaded Report in XLS format](https://user-images.githubusercontent.com/70251413/121723892-f5f2be00-ca9b-11eb-9231-2b4059f0a5fe.PNG)

If the above is the case, update/rename the file format of the XLS to a CSV manually.
![Changing the extension to CSV](https://user-images.githubusercontent.com/70251413/121723894-f68b5480-ca9b-11eb-8b64-815be0b9f370.PNG)

The CSV file is laid out in plain view and can analyzed using formulas to analytically or visually represent the data over time with multiple CSV files. The CSV dataset can also be used along side with data science programs to perform k-Nearest Neighbors (k-NN), decision trees, etc. to determine patterns within the dataset.
Example of the CSV file generated using the previous steps above:
![Example of the generated report of the selected locations](https://user-images.githubusercontent.com/70251413/121724875-5df5d400-ca9d-11eb-8b2f-3d05155e7412.PNG)