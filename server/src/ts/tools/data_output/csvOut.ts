import { JSONObject } from "puppeteer";

const dataOutput = require('../../../json/dataOutputIndex.json');
const ExcelJS = require('exceljs');

class CSVOut {
    private XLSXFormat: string[];
    private XLSXFormatOrder:JSONObject;
    private worksheet: any;
    private workbook:any;
    private date: Date;
    private headerRowNumber: number;
    private districtData:object;

    constructor()
    constructor(districtData:object)
    constructor(districtData?:object, target?:string, worksheet?:any) {
        this.date = new Date();
        this.workbook = new ExcelJS.Workbook();
        this.worksheet = this.workbook.addWorksheet(this.date.toISOString().slice(0,10));
        this.XLSXFormat = dataOutput['XLSX'][target];
        this.headerRowNumber = 1;
        this.XLSXFormatOrder = {};
        this.districtData = districtData;
        this.determineXLSXFormatOrder();
    }

    public async determineXLSXFormatOrder() {
        let XLSXFormatLength = this.XLSXFormat.length;
        while(XLSXFormatLength--) {
            this.XLSXFormatOrder[this.XLSXFormat[XLSXFormatLength]] = XLSXFormatLength + 1;
            this.worksheet.getRow(this.headerRowNumber).getCell((XLSXFormatLength + 1)).value = this.XLSXFormat[XLSXFormatLength];
        }
        //console.log(this.XLSXFormatOrder);
    }

    public async appendDataToXLSX() {
        let indexDataLength:number = this.getDataLength(this.districtData);
        let dataRowNumber = this.headerRowNumber + 2;
        // cycle through top level indexing
        while(indexDataLength--) {
            let districtName:string = Object.keys(this.districtData[indexDataLength])[0];
            // length - 1 ignores the district name
            let districtURLLength:number = Object.keys(this.districtData[indexDataLength]).length - 1;
            let districtDataLength:number = this.getDataLength(this.districtData[indexDataLength]);

            // cycle through URLs where property information is store
            while(districtURLLength--) {
                // the company's property link
                let districtURL:string = Object.keys(this.districtData[indexDataLength])[districtURLLength + 1];
                // list of properties offered by the company
                let property:object[] = Object.values(Object.values(this.districtData[indexDataLength])[districtURLLength + 1])[0];
                // the number of properties rented by a company
                let propertyLength:number = property.length;
                // cycle through properties
                while(propertyLength--) {
                    // get key names of the property in the JSON object
                    let propertyInformationKeys: string[] = Object.keys(property[propertyLength]);
                    let propertyInformationKeysLength: number = propertyInformationKeys.length;
                    let propertyInformationValues: string[] = Object.values(property[propertyLength]);
                    // cycle through property information
                    while (propertyInformationKeysLength--) {
                        switch(propertyInformationKeys[propertyInformationKeysLength]) {
                            case "basic_information": {
                                // get the basic_information names of the property in the JSON object
                                let basicInformation:object = propertyInformationValues[propertyInformationKeysLength] as unknown as object;
                                let basicInformationKeys:string[] = Object.keys(basicInformation);
                                //basic_information values
                                let basicInformationValues: string[] = Object.values(basicInformation);
                                let basicInformationKeysLength:number = basicInformationKeys.length;

                                let referenceInformationKeys:string[] = Object.keys(await this.getXLSXFormatOrder());
                                let referenceInformationValues:number[] = Object.values(await this.getXLSXFormatOrder()) as unknown as number[];

                                // cycle through all basic_information keys
                                while(basicInformationKeysLength--) {
                                    let referenceInformationKeysLength:number = referenceInformationKeys.length;
                                    while(referenceInformationKeysLength--) {
                                        // basic data matches the referenced data
                                        if(basicInformationKeys[basicInformationKeysLength] == referenceInformationKeys[referenceInformationKeysLength]) {
                                            // append data on the current row on the column indicated by the reference
                                            this.worksheet.getRow(dataRowNumber).getCell(referenceInformationValues[referenceInformationKeysLength]).value = basicInformationValues[basicInformationKeysLength];
                                            break;
                                        }
                                    }
                                }
                                break;
                            }
                            case "In-Unit Amenity": {
                                let inUnitAmenity: string[] = propertyInformationValues[propertyInformationKeysLength] as unknown as string[];
                                let inUnitAmenityLength: number = inUnitAmenity.length;

                                let referenceInformationKeys:string[] = Object.keys(await this.getXLSXFormatOrder());
                                let referenceInformationValues:number[] = Object.values(await this.getXLSXFormatOrder()) as unknown as number[];
                                let inUnitAmenityTag: string = "(In-Unit Amenity)"

                                while(inUnitAmenityLength--) {
                                    let referenceInformationKeysLength:number = referenceInformationKeys.length;
                                    while(referenceInformationKeysLength--) {
                                        let cell: any = this.worksheet.getRow(dataRowNumber).getCell(referenceInformationValues[referenceInformationKeysLength]);
                                        if((inUnitAmenity[inUnitAmenityLength] + " " + inUnitAmenityTag) == referenceInformationKeys[referenceInformationKeysLength]) {
                                            cell.value = "YES";
                                            break;
                                        } else if(cell.value === null && referenceInformationKeys[referenceInformationKeysLength].includes(inUnitAmenityTag)) {
                                            cell.value = "NO";
                                        } 
                                    }
                                }
                                break;
                            }
                            case "Building Amenity": {
                                let buildingAmenity: string[] = propertyInformationValues[propertyInformationKeysLength] as unknown as string[];
                                let buildingAmenityLength: number = buildingAmenity.length;
                                
                                let referenceInformationKeys:string[] = Object.keys(await this.getXLSXFormatOrder());
                                let referenceInformationValues:number[] = Object.values(await this.getXLSXFormatOrder()) as unknown as number[];
                                let buildingAmenityTag: string = "(Building Amenity)"

                                while(buildingAmenityLength--) {
                                    let referenceInformationKeysLength:number = referenceInformationKeys.length;
                                    while(referenceInformationKeysLength--) {
                                        let cell: any = this.worksheet.getRow(dataRowNumber).getCell(referenceInformationValues[referenceInformationKeysLength]);
                                        if((buildingAmenity[buildingAmenityLength] + " " + buildingAmenityTag) == referenceInformationKeys[referenceInformationKeysLength]) {
                                            cell.value = "YES";
                                            break;
                                        } else if(cell.value === null && referenceInformationKeys[referenceInformationKeysLength].includes(buildingAmenityTag)) {
                                            cell.value = "NO";
                                        } 
                                    }
                                }
                                break;
                            }
                        }
                    }
                    dataRowNumber++;
                }
            }
        }
    }

    public async getXLSXFormatOrder(): Promise<JSONObject>{
        return this.XLSXFormatOrder;
    }

    private getDataLength(data:object):number {
        return Object.keys(data).length;
    }

    public async saveXLSX() {
        //let randomNumber:number = (Math.floor(Math.random() * 100000) + 100000);
        let filePath:string = "./tools/data_output/data/";
        let fileType:string = ".csv";
        let fileName: string = "Rent, Please! " + this.date.toISOString().slice(0,10) + " " + (this.date.getHours() + "꞉" + this.date.getMinutes() + "꞉" + this.date.getSeconds());// + " " + randomNumber;
        await this.workbook.csv.writeFile(filePath + fileName + fileType);
    }
}

module.exports = CSVOut;