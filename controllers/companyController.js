const mongoose = require('mongoose')
const Company = require('../models/company')
const Pricing = require('../models/pricing')

module.exports.addCompany = (req,res) => {
    const name = req.body.name
    const address = req.body.address
    const securityCode = req.body.securityCode

    Company.find({
        $and: [
            { name: name },
            { address: address },
            { securityCode: securityCode }
        ]
    })
    .exec()
    .then(result => {
        if(result.length===0){
            const company = new Company({
                _id: new mongoose.Types.ObjectId,
                name: name,
                address: address,
                securityCode: securityCode
            })

            company
            .save()
            .then(newCompany => {
                return res.status(201).json({
                    message: "Company added successfully",
                    company: newCompany
                })
            })
            .catch(err => {
                console.log(err);
                return res.status(500).json({
                    error: err
                })
            })

        } else {
            return res.status(400).json({
                message: "Company with same details already exists"
            })
        }
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({
            error: err
        })
    })
}

module.exports.getCompanies = async (req,res) => {
    const page = req.query.page || 0
    const companiesPerPage = 25

    try {
        const totalCompanies = await Company.countDocuments({});
        const totalPages = Math.ceil(totalCompanies / companiesPerPage);
    
        const companies = await Company.find({})
            .skip(page * companiesPerPage)
            .limit(companiesPerPage);
    
        const startResult = page * companiesPerPage + 1;
        const endResult = Math.min(startResult + companies.length - 1, totalCompanies);
    
        return res.status(200).json({
            companies: companies,
            totalPages: totalPages,
            totalCompanies: totalCompanies,
            resultRange: {
                start: parseInt(startResult),
                end: parseInt(endResult),
                total: parseInt(totalCompanies),
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
}

module.exports.filterCompanies = async (req,res) => {
    const page = req.query.page || 0
    const companiesPerPage = 3
    const value = req.query.value

    try {
        const allCompanies = await Company.find({})

        const result = allCompanies.filter((company) => {
            return (
                value &&
                company &&
                company.name &&
                company.name.toLowerCase().includes(value)
            )
        })

        const totalCompanies = result.length;
        const totalPages = Math.ceil(totalCompanies / companiesPerPage);
    
        const startIndex = (page) * companiesPerPage;
        const endIndex = startIndex + companiesPerPage;

        const paginatedCompanies = result.slice(startIndex, endIndex);
    
        const startResult = page * companiesPerPage + 1;
        const endResult = Math.min(startResult + paginatedCompanies.length - 1, totalCompanies);
    
        return res.status(200).json({
            companies: paginatedCompanies,
            totalPages: totalPages,
            totalCompanies: totalCompanies,
            resultRange: {
                start: parseInt(startResult),
                end: parseInt(endResult),
                total: parseInt(totalCompanies),
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
}

module.exports.filterCompaniesNoPagination = async (req,res) => {
    const value = req.query.value

    try {
        const allCompanies = await Company.find({})

        if(value.length===0){
            return res.status(200).json({
                companies: allCompanies,
            });
        }

        const result = allCompanies.filter((company) => {
            return (
                value &&
                company &&
                company.name &&
                company.name.toLowerCase().includes(value)
            )
        })
    
        return res.status(200).json({
            companies: result,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
}