const mongoose =  require('mongoose')
const connetDB = async () => {
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log("Database is connected...")
    }
    catch(error){
        console.log(`Error : ${error.message}`);
        process.exit(1)
    }
}
module.exports = connetDB;