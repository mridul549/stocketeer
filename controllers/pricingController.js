const mongoose = require('mongoose')
const Company = require('../models/company')
const Pricing = require('../models/pricing')

module.exports.setPrice = (req,res) => {
    const companyid = req.body.companyid
    const companyName = req.body.companyName
    const eps = req.body.eps
    const resultTime = req.body.resultTime

    const date = new Date()

    if(companyid.length!==24){
        return res.status(400).json({
            message: "Company Not found"
        })
    }

    console.log(req.body);
    Company.find({
        $and: [
            { _id: companyid },
            { name: companyName }
        ]
    })
    .exec()
    .then(async company => {
        if(company.length>0){
            const setting = await Pricing.findOneAndUpdate({ company: companyid }, {
                $push: {
                    prices: {
                        date: date,
                        eps: eps,
                        time: resultTime
                    }
                }
            }, { upsert: true })
            .exec()

            if(setting){
                return res.status(200).json({
                    message: `Price for ${companyName} set successfully`
                })
            } else {
                return res.status(400).json({
                    message: `Price for ${companyName} Not set`
                })
            }
        } else {
            return res.status(400).json({
                message: "Company Not found"
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
