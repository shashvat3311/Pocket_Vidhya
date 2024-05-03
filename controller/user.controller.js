const db = require("../dbConnections")
const express = require('express')
const jwt = require('jsonwebtoken');
const { body, Result } = require("express-validator");
require('dotenv').config();
const bcrypt = require('bcrypt');
const cors = require('cors')
const { request } = require('express');


const logout=async(req,res,next)=>{
    try{
        const token=req.headers.authorizattion.split(" ")[1]
        const decode=jwt.decode(token)

        const decoded_userid=decode.user_id
        db.query('update user set status="INACTIVE" where user_id=?',[decoded_userid],(err,result)=>{
            if(err){
                res.status(400).send({
                    success:false,
                    err:err

                })
            }
            if(result){
                res.status(200).send({
                    success:true,
                    msg:"Logout Success"
                })
            }
        })
    }
    catch(err){
        res.status(400).send({
            success:false,
            err:err
        })
    }
}

const signup = async (req, res, next) => {
    // try {

        await db.query('select * from user where username=? and mobile_no=? ', [req.body.username,req.body.mobile_no], (err1, result, feilds) => {

            if (err1) {
                res.status(400).send({
                    success: false,
                    err:err1
                })
            }
          else if (result) {
                 db.query(`update user set avtar='${req.body.avtar}' ,language=? where username=? and mobile_no=?`,[req.body.language,req.body.username,req.body.mobile_no],(berr,bresult)=>{
                    if(berr){
                        res.status(400).send({
                            success:false,
                            ere:berr
                        })
                    }
                if(bresult){
               
                const token = jwt.sign({ data: result }, process.env.POKET_VIDHYASACRET)
                if (result.length) {
                    res.send({
                        message: "User Already Exists",
                        success: true,
                        results:result,
                        token: token
                    })
                }
              else if (!result.length) {

                    db.query('Insert into user(username,mobile_no,Language,Avtar) values(?,?,?,?)', [req.body.username, req.body.mobile_no, req.body.Language, req.body.Avtar], (berr, bresult, feilds) => {
                        if (berr) {
                            res.status(400).send({
                                success: false,
                                err: berr
                            })
                        }
                        else if (bresult) {
                            db.query(`select * from user where username="${req.body.username}"`, (err, result, feilds) => {
                                if (err) {
                                    res.status(400).send({
                                        success: false,
                                        err: err
                                    })
                                }

                                if (result) {
                                    const token = jwt.sign({ data: result }, process.env.POKET_VIDHYASACRET)

                                    res.status(200).send({
                                        success: true,
                                        message: "New User Created",
                                        // results: bresult,
                                        token: token

                                    })
                                }
                            })
                        }
                    })

                }        
            }
        }) 
            }
        })

    // }
    // catch (err) {
    //     res.status(400).send({
    //         seccess: false,
    //         err: err.message
            
    //     })
    // }
}

const avtar_category = async (req, res) => {
    try {
        await db.query('Select * from Avtar', (err, results, feilds) => {
            if (err) {
                res.status(400).send({
                    success: false,
                    err: err
                })
            }
            else if (results) {
                res.status(200).send({
                    success: true,
                    results: results
                })
            }
        })
    }
    catch (err) {
        res.status(400).send({
            seccess: false,
            err: err
        })
    }

}
// **************************************

// const admin_addCategory=(req,res,next)=>{
//     await db.query('insert into category ')
// }*************************************
const adminLogin1 = async (req, res, next) => {
    db.query('Select * from admin where username=? and email=?', [req.body.username, req.body.email], (err, result, feilds) => {
        if (err) {
            res.status(400).send({
                success: false,
                err: err
            })
        }
        if (result) {
            if (!result.length) {
                res.status(404).send({
                    success: false,
                    msg: "Wrong Username ,email or Password"
                })
            }
          else {
           const  is_PasswordCorrect=bcrypt.compareSync(req.body.password,result[0].password)
           bcrypt.com
            
           //  console.log(result)
                       if(is_PasswordCorrect==true){
                          const token = jwt.sign({ data: [result[0]] }, process.env.POCKET_ADMIN_SECRET)
                           res.status(200).send({
                            success:true,
                            results:result,
                            token:token
                           })
                       }
                       if(is_PasswordCorrect==false){
                           res.status(400).send({
                            success:false,
                            msg:"Wrong Password"
                           })
                       }
                 
          }

            // else {
            //     is_PasswordCorrect = bcrypt.compareSync(req.body.password, result[0].password, (err) => {
            //             if (err) {
            //                 res.status(400).send({
            //                     success: false,
            //                     msg: "Wrong password",

            //                 })
            //             }
            //             else {
            //                 const token = jwt.sign({ data: result }, process.env.POCKET_ADMIN_SECRET)
            //                 res.status(200).send({
            //                     success: true,
            //                     msg: `User login Successfull`,
            //                     results: result,
            //                     token: token
            //                 })
            //             }
            //         })
            // }
        }

    })
}

const add_question = async (req, res, next) => {
    try {

        const auth = req.headers.authorization.split(" ")[1]
        const decode = jwt.decode(auth)
         
       
        let decoded_Username = decode.data[0].Admin_id
        
      
        await db.query('select * from questionnaire where question=? ', [req.body.Question], (err, result, feilds) => {
            if (err) {
                res.status(400).send({
                    success: false,
                    err: err,
                    block: 1
                })
            }
            if (result) {
                if (result.length > 0) {
                    res.status(200).send({
                        success: true,
                        msg: "Question Already Exists "
                    })
                }
                else {
                    db.query(`insert into questionnaire(Question,category,option1,option2,option3,option4,correct_option,Description,added_by) values(?,?,?,?,?,?,?,?,${decoded_Username})`,[req.body.Question, req.body.category, req.body.option1, req.body.option2, req.body.option3, req.body.option4, req.body.correct_option, req.body.Description], (berr, bresult, feilds) => {
                        if (berr) {
                            res.status(400).send({
                                success: false,
                                err: berr,
                            })
                        }
                        if (bresult) {
                            res.status(200).send({
                                success: true,
                                msg: `Question Added by Admin:${decoded_Username}`,
                                results: bresult
                            })
                        }

                    })
                }
            }

        })
 
    }
    catch (err) {
        res.status(400).send({
            seccess: false,
            err: err
        })
    }
}

const question = async (req, res, next) => {
    await db.query('select * from questionnaire where category=? order by rand()', [req.body.category], (err, result, feilds) => {
        if (err) {
            res.status(400).send({
                success: false,
                err: err
            })
        }
        if (result) {
            if (!result.length) {
                res.status(404).send({
                    success: false,
                    msg: "Category not"
                })
            }
            else {
                res.status(200).send({
                    success: true,
                    results: result
                })
            }

        }
    })
}

const add_avtar = async (req, res, next) => {
    try {
        var file = req.file.filename
        await db.query('Insert into avtar(Avtar_id,avtar,image) values(?,?,?)', [req.body.Avtar_id, req.body.avtar, file], (err, result, feilds) => {
            if (err) {
                res.status(400).send({
                    success: false,
                    err: err
                })
            }
            if (result) {
                res.status(200).send({
                    success: true,
                    msg: "Avtar Added",
                    avtar_url: `127.0.0.1:5000/${file}`,
                    results: result

                })
            }
        })
    }
    catch (err) {
        res.status(400).send({
            success: false,
            msg: "Error due to try block",
            err: err
        })
    }

}

const get_question_user = async (req, res, next) => {

    const default_status = "ACTIVE";
    try {
        await db.query('Select Question_id,Question,option1,option2,option3,option4,correct_option,Description from questionnaire where status= ? and category=? and level=1 order by rand()', [default_status, req.body.category], (err, result, feilds) => {
           if(!req.body.category ){
               res.status(404).send({
                success:false,
                msg:"Please enter category"
               })
           }
           
         else if (err) {
                res.status(400).send({
                    success: false,
                    err: err
                })
            }
            else if (result) {
                if (!result.length) {
                    res.status(400).send({
                        success: false,
                        msg: `No Questions found for category ${req.body.category}`
                    })
                }
                else {
                    res.status(200).send({
                        success: true,
                        results: result
                    })
                }
            }
        })
    }
    catch (err) {
        res.status(400).send({
            success: false,
            err: err
        })
    }
}

const admin_signup = async (req, res, next) => {
    try {
        await db.query(`select * from admin where username=? and email=? and password=?`, [req.body.username, req.body.email, req.body.password], (err, result, feilds) => {
            if (err) {
                res.status(400).send({
                    success: false,
                    err: err
                })
            }
            if (result) {
                if (result.length) {
                    res.status(302).send({
                        success: false,
                        msg: "User Already Exists"
                    })
                }
                else {
                    const EncryptedPassword = bcrypt.hashSync(req.body.password, 10)
                    //  const EncryptedPassword=  bcrypt.hash(req.body.password, 10, (err) => {
                    // if (err) {
                    //     return res.status(400).send({
                    //         success: false,
                    //         err: err
                    //     })
                    // }
                    // else {
                    db.query('Insert into Admin(username,email,password) values(?,?,?)', [req.body.username, req.body.email, EncryptedPassword], (err, result, feilds) => {
                        if (err) {
                            return res.status(400).send({
                                success: false,
                                err: err
                            })
                        }
                        if (result) {
                            return res.status(200).send({
                                success: true,
                                message: `New Admin ${req.body.username} Registered Successfully`,
                                results: result
                            })
                        }
                    })
                    // }
                    // })
                }
            }
        })
    }
    catch (err) {
        if (er) {
            res.status(400).send({
                success: false,
                err: err
            })
        }
    }
}

const admin_update_question = async (req, res, next) => {

    try {
        const auth = req.headers.authorization.split(" ")[1]
        const decode = jwt.decode(auth)

        const decoded_Username = decode.data[0].Admin_id

        await db.query(`Update question set Question=? and category=?, Option1=? and option2=? and optionn3=? and option4=? and correct_option=? and Description=? and Language=? and q_order=? and Status=? and updated_at=${now()} where question_id=? ,added_by=?`, [req.body.Question, req.body.category, req.body.option1, req.body.option2, req.body.option3, req.body.option4, req.body.correct_Option, req.body.Description, req.body.Language, req.body.q_order, req.body.Status, req.body.question_id, decoded_Username], (err, result, feilds) => {
            if (err) {
                res.status(400).send({
                    success: false,
                    err: err
                })
            }
            if (result) {
                res.status(200).send({
                    success: true,
                    results: result
                })
            }
        })
    }
    catch (err) {
        if (err) {
            res.status(400).send({
                success: false,
                err: err
            })
        }
    }
}

const admin_add_category = async (req, res, next) => {

    const auth = req.headers.authorization.split(" ")[1]
    const decode = jwt.decode(auth)

    const decoded_Username = decode.data[0].Admin_id
    const decoded = jwt.decode.username

    try {


        await db.query('Insert into category (category,added_by) values(?,?)', [req.body.category, decoded_Username
        ], (err, result, feilds) => {
            if (err) {
                res.status(400).send({
                    success: true,
                    err: err,

                })
            }
            if (result) {
                res.status(200).send({
                    success: true,
                    msg: `New category ${req.body.category} added `,
                    results: result

                })
            }

        })
    }
    catch (err) {
        if (err) {
            res.status(400).send({
                ssuccess: false,
                err: err.message
            })
        }
    }
}

const admin_add_language = async (req, res, next) => {
    try {
        const auth = req.headers.authorization.split(" ")[1]
        const decode = jwt.decode(auth)

        const decoded_Username = decode.data[0].Admin_id


        const token = req.headers.Autherization;
        // const decoded = token.decode.username
        await db.query('Insert into language (language,added_by) values(?,?)', [req.body.language, decoded_Username], (err, result, feilds) => {
            if (err) {
                res.status(400).send({
                    success: true,
                    err: err
                })
            }
            if (result) {
                res.status(200).send({
                    success: true,
                    results: result
                })
            }

        })
    }
    catch (err) {
        if (err) {
            res.status(400).send({
                ssuccess: false,
                err: err.message,
                err_code: err.code
            })
        }
    }
}

const admin_delete_language = async (req, res, next) => {



    db.query('Delete from language where language? or language_id=?', [req.body.language_id, req.body.language], (err, result, feilds) => {
        if (err) {
            res.status(400).send({
                success: false,
                err: err
            })
        }
        if (result) {
            if (!result.length) {
                res.status(400).send({
                    success: false,
                    msg: `question_id:${req.body.question_id} do not exists`
                })
            }
            else {
                res.status(200).send({
                    success: true,
                    results: result
                })
            }
        }
    })
}

const total_language = async (req, res, next) => {
    await db.query('select count(language_id) as Total_language from language', (err, result) => {

        db.query('select count(category_id) as Total_Category from category', (aerr, aresult) => {

            db.query('select count(user_id) as Total_Users from user', (berr, bresult) => {

                db.query('select count(admin_id) as Total_Admins from admin', (cerr, cresult) => {

                    if (cerr || berr || aerr || err) {
                        res.status(400).send({
                            success: false,
                            err: err || aerr || berr || cerr
                        })
                    }
                    else {

                        res.status(200).send({
                            success: true,
                            results: [{
                                Total_Admin: cresult[0].Total_Admins,
                                Total_Users: bresult[0].Total_Users,
                                Total_Languages: result[0].Total_language,
                                Total_Categories: aresult[0].Total_Category
                            }]

                        })
                    }
                })
            })
        })
    })
}

const quiz_category = async (req, res, next) => {
    try {
        await db.query('select category from category', (err, result) => {
            if (err) {
                res.status(400).send({
                    success: false,
                    err: err
                })
            }

            if (result) {
                console.log(result)
                res.status(200).send({
                    success: true,
                    results: result
                })
            }
        })
    }
    catch (err) {
        res.status(400).send({
            success: false,
            err: err
        }
        )
    }
}

const admin_update_questionStatus = async (req, res, next) => {
    try {
        await db.query('select question_id from questionnaire where question_id=?', [req.body.question_id], (err, result, feilds) => {

            if (err) {
                res.status(400).send({

                    success: false,
                    err: err
                })
            }
            if (result) {
                db.query('update questionnaire set Status=? where question_id=?', [req.body.Status, req.body.question_id], (berr, bresult, feilds) => {
                    if (berr) {
                        res.status(400).send({
                            success: false,
                            err: err
                        })
                    }
                    if (bresult) {
                        res.status(200).send({
                            success: true,
                            msg: `Status updated to:'${req.body.Status}' for question_id:${req.body.question_id}`
                        })
                    }
                })
            }
        })
    }

    catch (err) {
        if (err) {
            res.status(400).send({
                err: err
            })
        }
    }
}

const answer1 = async (req, res, next) => {

    try {

        const auth = req.headers.authorization.split(" ")[1]
        const decode = jwt.decode(auth)

        const decoded_Username = decode.data[0].user_id



        db.query('Select * from questionnaire where question_id=?', [req.body.question_id], (question_err, question_result) => {
            if (question_err) {
                res.status(400).send({
                    success: false,
                    err: err
                })
            }

            if (question_result) {

                if (!question_result.length) {
                    res.status(404).send({
                        success: false,
                        msg: `question for id:${req.body.question_id} not found`
                    })
                }
                else {
                    if (req.body.answer == question_result[0].correct_Option) {
                        var isCorrectans = '1'
                    }
                    else if (req.body.answer !== question_result[0].correct_Option) {
                        var isCorrectans = '0'
                    }
                    db.query('Insert into answer (user_id,question_id,category,answer,isCorrect) values(?,?,?,?,?)', [decoded_Username, req.body.question_id, question_result[0].category, req.body.answer, isCorrectans], (answer_err, answer_result, feilds) => {
                        if (answer_err) {
                            res.status(400).send({
                                success: false,
                                err: answer_err
                            })
                        }
                        else if (answer_result) {
                            res.status(200).send({
                                success: true,
                                isCorrect: isCorrectans,


                            })
                        }
                    })
                }
            }

        })
    }
    catch (err) {
        res.status(400).send({
            success: false,
            err: err.message
        })
    }
}

const admin_Statistics = async (req, res, next) => {
    try {
        const auth = req.headers.authorization.split(" ")[1]
        const decode = jwt.decode(auth)

        const decoded_Username = decode.data[0].user_id

        db.query('Select * from attempts where user_id=? and category=?', [decoded_Username, req.body.category], (err, result) => {
            if (err) {
                res.status(400).send({
                    success: false,
                    err: err
                })
            }
            if (result){
                if (!result.length) {
                   res.status(404).send({
                    success:false,
                    msg:`No attempts for user:${decoded_Username} for category:${req.body.category}`
                   })
                }
                else {
                    res.status(200).send({
                        success: true,
                        results: result
                    })
                }
            }
        })
    }
    catch (err) {
        res.status(400).send({
            success: false,
            err: err
        })
    }
}

const admin_get_user=async(req,res,next)=>{
    await db.query('select * from user',(err,result)=>{
        if(err){
            res.status(400).send({
                success:false,
                err:err
            })
        }
        if(result){
            if(!result.length){
                res.status(204).send({
                    success:true,
                    msg:"No Users till Now"
                })
            }
            else{
              res.status(200).send({
                success:true,
                results:result
              })
            }
        }

    })
}

const admin_getQuestion=async(req,res,next)=>{
    try{
        await db.query("Select * from questionnaire where category=?",[req.query.category],(err,result)=>{
            if(err){
                res.status(400).send({
                    success:false,
                    err:err
                })
            }
            if(result){
                res.status(200).send({
                    success:true,
                    results:result
                })
            }
        })
    }
    catch(Exeption){
        res.status(400).send({
            success:false,
            err:Exeption
        })
    }
}

const StartAttempt=async(req,res,next)=>{
    try{

        const auth = req.headers.authorization.split(" ")[1]
        const decode = jwt.decode(auth)

        const decoded_Username = decode.data[0].user_id

       await db.query(`select * from questionnaire where category=? and Status='ACTIVE' order by rand()`,[req.body.category],(err,result)=>{
        if(!req.body.category){
            res.status(404).send({
                success:false,
                msg:"Please enter category"
            })
        }
        else if(err){
            res.status(400).send({
                success:false,
                err:err
            })
        }
        else if(result){
            if(!result.length){
                res.status(404).send({
                    success:false,
                    msg:`category:${req.body.category} does not exists`
                })
            }
            else{
                for (let index = 0; index < result.length; index++) {
                  db.query("Insert into question(user_id,question_id,Question,category,level,option1,option2,option3,option4,Description) values(?,?,?,?,?,?,?,?,?,?) ",[decoded_Username, result[index].question_id, result[index].Question, result[index].category, result[index].level, result[index].option1, result[index].option2, result[index].option3, result[index].option4, result[index].Description],(err,result)=>{
                    if(err){
                        console.log(err)
                    }
                    if(result){
                        console.log(result)
                    }
                  })
                }
                res.status(200).send({
                    success:true,
                    msg:"Lets Start the Quiz"
                })
            }
        }
       })
    }
    catch(err){
        res.status(400).send({
            success:false,
            err:err.message
        })
    }
}
module.exports = {
    signup, avtar_category, add_question, question, add_avtar, admin_signup, get_question_user, admin_update_question, admin_add_category, admin_add_language, admin_delete_language, total_language, admin_update_questionStatus, adminLogin1, answer1, quiz_category, admin_Statistics,logout,admin_get_user,admin_getQuestion,StartAttempt
}
// increase_attemptscfgydebn