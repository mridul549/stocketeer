const ExcelJS = require('exceljs');
const Pricing = require('../models/pricing')
const Company = require('../models/company')
const fs = require('fs');

module.exports.createSheet = (req,res) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Root');
    sheet.columns = [
        { header: 'S.No.', key: 'id', width: 10 },
        { header: 'Company Name', key: 'companyName', width: 32 },
        { header: 'Security Code', key: 'securityCode', width: 20 },
        { header: 'City', key: 'city', width: 20 },
        { header: 'State', key: 'state', width: 20 }
    ];

    sheet.addRow({ id: 1, companyName: 'John Doe', securityCode: 25, city: 'USA', state: 'USA' });
    sheet.addRow({ id: 1, companyName: 'John Doe', securityCode: 25, city: 'USA', state: 'USA' });
    sheet.addRow({ id: 1, companyName: 'John Doe', securityCode: 25, city: 'USA', state: 'USA' });
    sheet.addRow({ id: 1, companyName: 'John Doe', securityCode: 25, city: 'USA', state: 'USA' });
    sheet.addRow({ id: 1, companyName: 'John Doe', securityCode: 25, city: 'USA', state: 'USA' });

    sheet.mergeCells("A1:A3")
    sheet.mergeCells("B1:B3")
    sheet.mergeCells("C1:C3")
    sheet.mergeCells("D1:D3")
    sheet.mergeCells("E1:E3")

    sheet.getCell("A1:A3").alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell("B1:B3").alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell("C1:C3").alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell("D1:D3").alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.getCell("E1:E3").alignment = { vertical: 'middle', horizontal: 'center' };

    const filename = 'sheet.xls';

    // Set the path to the directory where you want to save the file
    const directoryPath = './sheets/';

    // Set up the full path to the file
    const fullPath = directoryPath + filename;

    // Write the workbook to a file
    workbook.xlsx.writeFile(fullPath)
    .then(() => {
        console.log(`File ${filename} saved to ${directoryPath}`);
    })
    .catch((err) => {
        console.error('Error saving file:', err);
    });

    return res.status(200).json({
        message: 'okay bro'
    })
}
