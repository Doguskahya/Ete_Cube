const mongoose = require("mongoose");

const ProductInfoSchema = new mongoose.Schema(
    {
        productName: String,
        productCategory: String,
        productAmount: String,
        amountUnit: String,
        company: String,
        date: Date,
    },
    {
        collection: "ProductInfo",
    }
);

mongoose.model("ProductInfo", ProductInfoSchema);