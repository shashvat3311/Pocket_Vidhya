
const mysql=require('mysql');
const db=mysql.createConnection({
    user:"root",
    password:"shashvat",
    host:"localhost",
    database:"pocket_vidhya"
})
db.connect((err)=>{

    if(err){
        console.log("Can't Connected")
    }
    else{
        console.log("Database Connected")
    }
    
})
module.exports=db
