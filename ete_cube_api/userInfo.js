const mongoose = require("mongoose");

const UserInfoSchema = new mongoose.Schema(
    {
        username: { type: String, unique: true},
        password: String,
    },
    {
        collection: "UserInfo",
    }
);

mongoose.model("UserInfo", UserInfoSchema);