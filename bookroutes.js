const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
    region : "eu-west-1",
    //  accessKeyId : process.env.AWS_ACCESS_KEY,
    //  secretAccessKey : process.env.AWS_SECRET_KEY,
    endpoint : "http://localhost:8000"
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const tableName = "book"

const createBook = async(req,res,next) =>{
    try {
        const params = {
            TableName : tableName,
            Item: req.body
    }
    await dynamoClient.put(params).promise()
    return res.status(200).json({msg : "Data Added successfully...!"})
    } catch (e) {
        console.log("e..",e);
    }
}
const getAllbook = async (req,res,next) =>{
    try {
        let params;
        // const search = req.query.search;
        // if(search){
        //     params = {
        //         TableName : tableName,
        //         FilterExpression: "contains (#name,:name_val) OR contains (#productId,:productId)",
        //         ExpressionAttributeNames:{
        //             "#name":"name",
        //             "#productId":"productId"
        //         },
        //         ExpressionAttributeValues:{
        //             ":name_val" : search,
        //             ":productId" : search
        //         }
        //     }
        // }else{
            params = {
                TableName : tableName,
            }
        // }
        
        const getdata = await dynamoClient.scan(params).promise();
        res.status(200).json(getdata)
    } catch (e) {
        console.log("e..",e);
    }
}

const updateBook = async (req,res,next) =>{
    try {
        const title = req.query.title
        const params = {
            TableName : tableName,
            Key : {
                title : title,
                // author : req.body.author
            },
            Item : {
                // title : title,
                author : req.body.author
            }
        }
        await dynamoClient.update(params).promise()
        res.status(200).json({msg : "update Successfully...!"})
    } catch (e) {
        console.log("e..",e);
    }
}

const getBookById = async (req,res,next) =>{
    try {
        const title = req.query.title
        const author = req.query.author

        
        const params = {
            TableName : tableName,
            Key : {
                title : title,
                author : author
            }
        }
        const getdata = await dynamoClient.get(params).promise();
        res.status(200).json(getdata)
    } catch (e) {
        console.log("e..",e);
    }
}

const deleteBookByID = async (req,res,next) =>{
    try {
        const title = req.query.title;
        const author = req.query.author

        const params = {
            TableName : tableName,
            Key : {
                title : title,
                author : author
            }
        }
        const deleteItem = await dynamoClient.delete(params).promise()
        res.status(200).json({msg : "delete item successfully..!"})
    } catch (e) {
        console.log("e..",e);
    }
}
module.exports = {
    getAllbook,
    createBook,
    getBookById,
    deleteBookByID,
    updateBook
}