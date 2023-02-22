const mongoose = require("mongoose");

const CompanyInfoSchema = new mongoose.Schema(
    {
        companyName: { type: String, unique: true},
        companyLegalNum: String,
        incorpCountry: String,
        webSite: String,
        date: Date,
    },
    {
        collection: "CompanyInfo",
    }
);

mongoose.model("CompanyInfo", CompanyInfoSchema);
