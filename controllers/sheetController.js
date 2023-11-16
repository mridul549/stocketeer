const ExcelJS = require('exceljs');
const Pricing = require('../models/pricing')
const Company = require('../models/company')
const fs = require('fs');

const Quarters = ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]
const Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

const yearStructure = (sheet, year) => {

    sheet.columns = [
        ...sheet.columns,
        { header: year, key: `year-${year}`, width: { pixels: 20 * 50 } },
    ];
    
    const startHeaderKey = `year-${year}`;
    const startIndex = sheet.columns.findIndex(col => col.key === startHeaderKey);
    
    sheet.mergeCells(1, startIndex + 1, 1, startIndex + 24);
    sheet.getCell(1, startIndex + 1).alignment = { horizontal: 'center', vertical: 'middle' };
    
    sheet.addRow({ header1: 'Value1', header2: 'Value2', header3: 'Value3' });

    Quarters.forEach((quarter, index) => {
        const startQuarterIndex = startIndex + 1 + index * 6;
        const endQuarterIndex = startQuarterIndex + 5;
        
        // Each quarter spans 6 cells
        sheet.mergeCells(2, startQuarterIndex, 2, endQuarterIndex);
        sheet.getCell(2, startQuarterIndex).alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getCell(2, startQuarterIndex).value = quarter;
        sheet.getCell(2, startQuarterIndex).font = { bold: true }; // Make Quarter cell bold
    });
    
    Months.forEach((month, index) => {
        // Each month spans 2 cells
        sheet.mergeCells(3, startIndex + index * 2 + 1, 3, startIndex + index * 2 + 2);
        sheet.getCell(3, startIndex + index * 2 + 1).alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getCell(3, startIndex + index * 2 + 1).value = month;

        sheet.getCell(4, startIndex + index * 2 + 1).value = "ESP";
        sheet.getCell(4, startIndex + index * 2 + 1).font = { bold: true }; // Make ESP cell bold

        sheet.getCell(4, startIndex + index * 2 + 2).value = "Result Time";
        sheet.getCell(4, startIndex + index * 2 + 2).font = { bold: true }; // Make Result Time cell bold

        sheet.getCell(4, startIndex + index * 2 + 1).alignment = { horizontal: 'center'};
        sheet.getCell(4, startIndex + index * 2 + 2).alignment = { horizontal: 'center' };
    });
}

const setColor = (sheet, row, color) => {
    sheet.getRow(row).eachCell({ includeEmpty: true }, cell => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: color } 
        };
        cell.font ={
            size: 12,
            bold: true
        }
    })
}

module.exports.createSheet = async (req,res) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Root');

    const Years = new Set();

    sheet.columns = [
        { header: 'S.No.', key: 'id', width: 10 },
        { header: 'Company Name', key: 'companyName', width: 32 },
        { header: 'Security Code', key: 'securityCode', width: 20 },
        { header: 'City', key: 'city', width: 20 },
        { header: 'State', key: 'state', width: 20 }
    ];

    sheet.mergeCells("A1:A4")
    sheet.mergeCells("B1:B4")
    sheet.mergeCells("C1:C4")
    sheet.mergeCells("D1:D4")
    sheet.mergeCells("E1:E4")
    
    sheet.getCell("A1:A4").alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell("B1:B4").alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell("C1:C4").alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell("D1:D4").alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell("E1:E4").alignment = { vertical: 'middle', horizontal: 'center' };

    Pricing.find({})
    .populate('company')
    .exec()
    .then(async result => {
        for (let i = 0; i < result.length; i++) {
            const element = result[i];

            const company = element.company
            const prices = element.prices

            let rowArray = [i+1, company.name, company.securityCode, company.address.city, company.address.state]
            let lastMonth = 0

            for (let i = 0; i < prices.length; i++) {
                const priceElement = prices[i];
                const date = new Date(priceElement.date)

                if(!Years.has(date.getFullYear().toString())){
                    if(lastMonth!==0){
                        for (let leftMonths = lastMonth; leftMonths < 12; leftMonths++) {
                            rowArray.push('-')
                            rowArray.push('-')
                        }
                    }
                    lastMonth=0
                    yearStructure(sheet, date.getFullYear().toString())
                    Years.add(date.getFullYear().toString())
                } 

                const monthObtained = date.getMonth()
                for (let monthIndex = lastMonth; monthIndex < 12; monthIndex++) {

                    if(monthObtained!==monthIndex){
                        rowArray.push('-')
                        rowArray.push('-')
                    } else {
                        rowArray.push(priceElement.eps)
                        rowArray.push(priceElement.time)
                        lastMonth=monthIndex+1
                        break
                    }
                    
                }
            }
            sheet.addRow(rowArray)
            const addedRow = sheet.lastRow;
            addedRow.eachCell({ includeEmpty: true }, cell => {
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });
        }

        sheet.spliceRows(5, Years.size);
        sheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                if (rowNumber > 4) {
                    cell.border = {
                        left: { style: 'thin' },
                        right: { style: 'thin' },
                    };
                } else {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' },
                    };
                }
            });
        });

        for (let columnIndex = 5; columnIndex < sheet.columns.length; columnIndex++) {
            sheet.columns[columnIndex].width = 15;
        }

        setColor(sheet, 1, 'D9EAD4')
        setColor(sheet, 2, 'FFF1CE')
        setColor(sheet, 3, 'F4CCCC')
        setColor(sheet, 4, 'CFE4F2')

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=sheet.xlsx');

        // Write the workbook to the response
        await workbook.xlsx.write(res);

        // End the response
        res.end();

    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({
            error: err
        })
    })


}
