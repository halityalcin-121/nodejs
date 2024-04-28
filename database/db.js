const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const uri = process.env.DATABASE;


const connection = () => {
    mongoose.connect(uri)
        .then((() => console.log("basarili baglanti")))
        .catch((err) => console.log(err));
}

module.exports = connection;