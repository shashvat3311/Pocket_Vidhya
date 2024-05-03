const db = require("../dbConnections")

const jwt = require('jsonwebtoken');
require('dotenv').config();




// const QA = async (req, res, next) => {
//     try {

//         const auth = req.headers.authorization.split(" ")[1]
//         const decode = jwt.decode(auth)
//         const decoded_userId = decode.data[0].user_id
//         // db.query('select question_id from questionnaire where category="?" order by rand()',[req.body.])

//         db.query("select Question_id,Question,category,level,option1, option2, option3, option4,Description from demo_question where category=? and Status='ACTIVE' and level=? order by rand()", [req.body.category, req.body.level], (err, result) => {
//             if (!req.body.category || !req.body.level) {
//                 res.status(404).send({
//                     success: false,
//                     msg: "Please Enter category and level"
//                 })
//             }
//             else if (err) {
//                 res.status(400).send({
//                     success: false,
//                     err: err
//                 })
//             }
//             else if (result) {
//                 if (!result.length) {
//                     res.status(404).send({
//                         success: false,
//                         msg: `No Questions are Available for category:${req.body.category} or level:${req.body.level}`
//                     })
//                 }
//                 else {

//                     for (let index = 0; index < result.length; index++) {
//                         db.query('Insert into question(user_id,Question_id,Question,category,level,option1, option2, option3, option4,Description)values(?,?,?,?,?,?,?,?,?,?)', [decoded_userId, result[index].Question_id, result[index].Question, result[index].category, result[index].level, result[index].option1, result[index].option2, result[index].option3, result[index].option4, result[index].Description], (err, result) => {

//                         })

//                         db.query(`select * from question where category ="${req.body.category}"`, (err, results) => {
//                             if (err) {
//                                 res.status(400).send({
//                                     success: false,
//                                     err: err
//                                 })
//                             }
//                             if (results) {
//                                 res.status(200).send({
//                                     success: true,
//                                     result: results
//                                 })
//                             }
//                         })
//                     }
//                 }
//             }
//         })
//     }
//     catch (err) {
//         res.status(400).send({
//             success: false,
//             err: err.message
//         })
//     }
// }


// const UpdatedQA=async(req,res,next)=>{
//     try {

//         const auth = req.headers.authorization.split(" ")[1]
//         const decode = jwt.decode(auth)

//         const decoded_Username = decode.data[0].user_id

//         db.query(`select * from demmo_question where question_id not in(select question_id from answer where category="?" and user_id=?)limit 1`, [req.body.category,decoded_Username], (q_err,q_result) => {
//             if(!req.body.category){
//                 res.status(404).send({
//                     success:false,
//                     msg:"Please Enter category"
//             })
//             }
            
//            else if (q_err) {
//                 res.status(400).send({
//                     success: false,
//                     err: q_err
//                 })
//             }

//             else if (q_result) {
          

//                 if (!q_result.length) {
//                     res.status(404).send({
//                         success: false,
//                         msg: `question for id:${req.body.question_id} not found or question is INACTIVE`
//                     })
//                 }
//                 else {
//                     console.log(q_result)
//                     db.query("select question_id, correct_option from questionnaire where question_id=?",[q_result[0].Question_id],(question_err,question_result)=>{
 
//                         if(question_err){
//                             res.status(400).send({
//                                 success:false,
//                                 err:question_err
//                             })
//                         }
    
//                         if(question_result){
//                             if(!question_result.length){
//                                 res.status(404).send({
//                                     success:false,
//                                     msg:`Quesstions not Found for question_id:${q_result[0].Question_id}` 
//                                 })
//                             }
//                         }                   
                     
//         //             if (req.body.answer != question_result[0].correct_Option) {
//         //                 var isCorrectans = '0'
//         //             }
//         //             if (req.body.answer == question_result[0].correct_Option) {
//         //                 var isCorrectans = '1'
//         //             }

//         //             db.query('Insert into  answer (user_id,question_id,category,answer,isCorrect) values(?,?,?,?,?)', [decoded_Username, req.body.question_id, question_result[0].category, req.body.answer, isCorrectans], (answerInsert_err, answerInsert_result, feilds) => {
//         //                 if (answerInsert_err) {
//         //                     res.status(400).send({
//         //                         success: false,
//         //                         err: answerInsert_err
//         //                     })
//         //                 }
//         //                 else if (answerInsert_result) {
//         //                     db.query(`select *, count(distinct(question_id)) as total_Question_Answered from  answer where user_id=? and category=?`, [decoded_Username, question_result[0].category], (totalAnswer_err, totalAnswer_result, feilds) => {
//         //                         if (totalAnswer_err) {
//         //                             res.status(400).send({
//         //                                 success: false,
//         //                                 totalAnswererr: totalAnswer_err
//         //                             })
//         //                         }
//         //                         if (totalAnswer_result) {
//         //                             // console.log(question_result[0].category)

//         //                             //This seelects the total no of Active questions from questionnaire table 
//         //                             // console.log(totalAnswer_result)
//         //                             db.query(`select question_id,count(question_id) as Total_Available_Questions from questionnaire where status='ACTIVE' and category='${question_result[0].category}'`, (totalQuestion_err, totalQuestion_result) => {
//         //                                 if (totalQuestion_err) {
//         //                                     res.status(400).send({
//         //                                         success: false,
//         //                                         err: totalAnswer_err
//         //                                     })
//         //                                 }
//         //                                 if (totalQuestion_result) {

//         //                                     // console.log(totalQuestion_err)

//         //                                     db.query(`select count(distinct(question_id)) as Total_Correct_Answers from  answer where user_id =? and isCorrect='1' and category=?`, [decoded_Username, question_result[0].category], (correctAnswer_err, correctAnswer_result) => {

//         //                                         if (correctAnswer_err) {
//         //                                             res.status(400).send({
//         //                                                 success: false,
//         //                                                 err: correctAnswer_result
//         //                                             })
//         //                                         }
//         //                                         if (correctAnswer_result) {
//         //                                             // const Total_Questions = totalQuestion_result[0].To
//         //                                             const Total_Available_Questions = totalQuestion_result[0].Total_Available_Questions

//         //                                             const Total_Correct_Answers = correctAnswer_result[0].Total_Correct_Answers

//         //                                             const Total_Questions_Attempted = totalAnswer_result[0].total_Question_Answered

//         //                                             const Questions_RemainnigTo_Attempt = Total_Available_Questions - Total_Questions_Attempted

//         //                                             const Total_Incorrect_Answers = Total_Questions_Attempted - Total_Correct_Answers
//         //                                             if (Total_Questions_Attempted >= Total_Available_Questions) {

//         //                                                 db.query("Insert into attempts(user_id,category,q_attempted,correct_Answers,Score) values(?,?,?,?,?) ", [decoded_Username, question_result[0].category, Total_Questions_Attempted, Total_Correct_Answers, Total_Correct_Answers], (insertAttempt_err, insertAttempt_result) => {
//         //                                                     if (insertAttempt_err) {
//         //                                                         res.status(400).send({
//         //                                                             success: false,
//         //                                                             err: insertAttempt_err
//         //                                                         })
//         //                                                     }
//         //                                                     if (insertAttempt_result) {

//         //                                                         db.query('delete from  answer where user_id=? and category=?', [decoded_Username, question_result[0].category], (vacantAnswer_err, vacantAnswer_result) => {
//         //                                                             if (vacantAnswer_err) {
//         //                                                                 res.status(400).send({
//         //                                                                     success: false,
//         //                                                                     err: vacantAnswer_err
//         //                                                                 })
//         //                                                             }
//         //                                                             if (vacantAnswer_result) {
//         //                                                                 res.status(200).send({
//         //                                                                     success: true,
//         //                                                                     isCorrect: isCorrectans,
//         //                                                                     msg: "Attempt Completed and counted",
//         //                                                                     Total_No_of_Questions: Total_Available_Questions,
//         //                                                                     Total_Question_Attempted: Total_Questions_Attempted,
//         //                                                                     Correct_Answers: Total_Correct_Answers,
//         //                                                                     Incorrect_Answers: Total_Incorrect_Answers,
//         //                                                                     Score: `${Total_Correct_Answers}/${Total_Available_Questions}`

//         //                                                                 })
//         //                                                             }

//         //                                                         })

//         //                                                     }

//         //                                                 })
//         //                                             }
//         //                                             else {

//         //                                                 res.status(200).send({
//         //                                                     success: true,
//         //                                                     isCorrect: isCorrectans,
//         //                                                     msg: `Remaining ${Questions_RemainnigTo_Attempt} questions Should be Initiated for counting an Attempt`,
//         //                                                     Total_No_of_Questions: Total_Available_Questions,
//         //                                                     Total_Question_Attempted: Total_Questions_Attempted,
//         //                                                     Correct_Answers: Total_Correct_Answers,
//         //                                                     Incorrect_Answers: Total_Incorrect_Answers,

//         //                                                 })
//         //                                             }
//         //                                         }
//         //                                     })
//         //                                 }
//         //                             })

//         //                         }

//         //                     })

//         //                 }
//         //             })
//         //         }
//                 })
//             }
//         }
//         })
//     }
//     catch (err) {
//         res.status(400).send({
//             success: false,
//             err: err.message
//         })
//     }
// }

const userQuestions=async(req,res,next)=>{
try{
    const auth = req.headers.authorization.split(" ")[1]
    const decode = jwt.decode(auth)

    const decoded_Username = decode.data[0].user_id

    await db.query(`select * from questionnaire where category=? and question_id not in(select question_id  from answer where category=? and user_id=? ) order by rand() limit 1`,[req.body.category,  req.body.category,decoded_Username],(err,result,feilds)=>{
        // if(!req.body.category){
        //     res.status(400).send({
        //         success:false,
        //         message:"please Enter category"
        //     })
        // }
          if(err){
            res.status(400).send({
               success:false,
               err:err
            })
           }
           else if(result){
            if(!result.length){
                res.status(404).send({
                    success:false,
                    // msg:`No questions found for ${req.body.category}`
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
catch(err){
   res.status(400).send({
    success:false,
    err:err.message 
   })
}
}

module.exports = {userQuestions}