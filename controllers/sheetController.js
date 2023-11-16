const ExcelJS = require('exceljs');
const Pricing = require('../models/pricing')
const Company = require('../models/company')

module.exports.createSheet = async (req,res) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Root');

    sheet.columns = [
        { header: 'S.No.', key: 'id', width: 10 },
        { header: 'Company Name', key: 'companyName', width: 32 },
        { header: 'Security Code', key: 'securityCode', width: 10, outlineLevel: 1 },
        { header: 'City', key: 'city', width: 10, outlineLevel: 1 },
        { header: 'State', key: 'state', width: 10, outlineLevel: 1 }
    ];
    
    workbook.xlsx.writeFile("sheet.xls")
    .then(function () {
        console.log('Excel file exported successfully!');
    })
    .catch(function (error) {
        console.log('Error exporting Excel file:', error);
    });
    return res.status(200).json({
        message: 'done'
    })
}
