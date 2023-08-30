const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
    region : process.env.REGION,
     accessKeyId : process.env.AWS_ACCESS_KEY,
     secretAccessKey : process.env.AWS_SECRET_KEY,
    // endpoint : "http://localhost:8000"
});

var dynamoClient = new AWS.DynamoDB.DocumentClient();
const tableName = "product"
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

// find a data when username equal to Admin in dynamodb database table
const getAdmin = async (req,res,next) => {
    try {
    
        params = {
            TableName : 'Users',
            FilterExpression: "#Users.#Username = :username",
            ExpressionAttributeNames:{
                '#Users' : 'Users',
                '#Username' : 'Username',
            },
            ExpressionAttributeValues:{
                ':username' : 'Admin'
            }
        }
        const getdata = await dynamoClient.scan(params).promise();
        res.status(200).json(getdata)
    } catch (e) {
        console.log("e..",e);
    }
}

// update user information inside user object and changes poweruseraccess value
const updatePowerUserAccess = async (req,res,next) => {
    try {
        const UserID = req.query.UserID
        const params = {
            TableName : 'Users',
            Key:{
                "UserID" : UserID
            },
            UpdateExpression : "set #Users.#Poweruseraccess = :poweruser_value",
            ExpressionAttributeNames:{
                '#Users' : 'Users',
                '#Poweruseraccess' : 'Poweruseraccess'
            },
            ExpressionAttributeValues : {
                ":poweruser_value" : req.body.poweruser
            },
            ReturnValues:"UPDATED_NEW"
        }
        await dynamoClient.update(params).promise()
        res.status(200).json({msg : "update Successfully...!"})
    } catch (e) {
        console.log("e..",e);
    }
}

//same above in update power user
const updateUseCase = async (req,res,next) => {
    try {
        const UserID = req.query.UserID
        const params = {
            TableName : 'Users',
            Key:{
                "UserID" : UserID
            },
            UpdateExpression : "set #Users.#useCase = :useCase_value",
            ExpressionAttributeNames:{
                '#Users' : 'Users',
                '#useCase' : 'useCase'
            },
            ExpressionAttributeValues : {
                ":useCase_value" : req.body.useCase
            },
            ReturnValues:"UPDATED_NEW"
        }
        await dynamoClient.update(params).promise()
        res.status(200).json({msg : "update Successfully...!"})
    } catch (e) {
        console.log("e..",e);
    }
}

// find one user and his response getting poweruser array. and store id into array and find it.
const getUserFromPowerUser = async (req,res,next) => {
    try {
        const UserID = req.query.UserID
        
        const params = {
            TableName : 'Users',
            Key : {
                UserID
            }
        }
        const getdata = await dynamoClient.get(params).promise();
  
        var titleObject = {}; 
        var index = 0; 
        if(getdata.Item.Users.Poweruseraccess.length > 0){
            getdata.Item.Users.Poweruseraccess.forEach(function(value) {
                index++;
                var titleKey = ":titlevalue"+index;
                titleObject[titleKey.toString()] = value;
            });
    
            var params2 = {
                TableName: "Users",
                FilterExpression: "UserID IN  ("+Object.keys(titleObject).toString()+ ")",
                ExpressionAttributeValues: titleObject,
            };
            const getdata2 = await dynamoClient.scan(params2).promise();
            res.status(200).json(getdata2)
        }else{
            res.status(200).json({data : getdata.Item.Users.Poweruseraccess,message : "you have not poweraccessuser"})
        }
        
    } catch (e) {
        console.log("e..",e);
    }
}
// same above
const getUseCaseFromUser = async(req,res,next) =>{
    try {
        const UserID = req.query.UserID
        
        const params = {
            TableName : 'Users',
            Key : {
                UserID
            }
        }
        const getdata = await dynamoClient.get(params).promise();
  
        var titleObject = {}; 
        var index = 0; 
        if(getdata.Item.Users.useCase.length > 0){
            getdata.Item.Users.useCase.forEach(function(value) {
                index++;
                var titleKey = ":titlevalue"+index;
                titleObject[titleKey.toString()] = value;
            });
    
            var params2 = {
                TableName: "UseCaseTemplates",
                FilterExpression: "UseCaseId IN  ("+Object.keys(titleObject).toString()+ ")",
                ExpressionAttributeValues: titleObject,
            };
            const getdata2 = await dynamoClient.scan(params2).promise();
            res.status(200).json(getdata2)
        }else{
            res.status(200).json({data : getdata.Item.Users.Poweruseraccess,message : "you have not poweraccessuser"})
        }
        
    } catch (e) {
        console.log("e..",e);
    }
}

// create api for finduser on userId in poweruser table. if exist then nothing. else create new poweruser with UserID and blank poweuser object.
const createPowerUser = async (req,res,next) => {
    try {
        const UserID = req.query.UserID;
        const params = {
            TableName : "Powerusers",
            Key : {
                UserID
            }
        }

        const getPowerUser = await dynamoClient.get(params).promise();
        console.log("getpoweruser..",getPowerUser.Item);
        if(getPowerUser.Item == undefined){
                const params1 = {
                    TableName : 'Powerusers',
                    Item: {
                        UserID : UserID,
                        Poweruser : {}
                    },
                    ReturnValues: 'ALL_OLD',
            };
            
            let data = await dynamoClient.put(params1).promise()
            console.log("da...",data);
            return res.status(200).json({msg : "Data Added Successfully...!"})
        }else{
            res.status(200).json(getPowerUser.Item)
        }
        
    } catch (e) {
        console.log("e",e);
    }
}

// find user from userId in user table. and create Name,address etc field in poweraccess table with userID and poweraccess obj.
const findUserAndcreatePowerUser = async (req,res,next) => {
    try {
        const UserID = req.query.UserID;
        const params = {
            TableName : "Users",
            Key : {
                UserID
            }
        }

        const getUser = await dynamoClient.get(params).promise();

        if(getUser.Item !== undefined){
            const params1 = {
                TableName : 'Powerusers',
                Item: {
                    UserID : UserID,
                    Poweruser : {
                        Address : getUser.Item.Users.Address,
                        Name : getUser.Item.Users.Name
                    }
                },
                ReturnValues: 'ALL_OLD',
        };
        
        let data = await dynamoClient.put(params1).promise()
        return res.status(200).json({msg : "Data Added Successfully...!"})
        }else{
            return res.status(200).json({msg : `User Not Found with this ${UserID}`})
        }

    } catch (e) {
        console.log("e.",e);
    }
}

const updateRoleInCognito = async (req,res,next) =>{
    try {
        const params1 = {
            UserAttributes : [
                {
                    Name : "custom:role",
                    Value : "Poweruser" 
                }
            ],
            UserPoolId : 'eu-west-1_MRerlcS4o',
            Username : 'jems'
        };
        
        cognitoidentityserviceprovider.adminUpdateUserAttributes(params1,(errr,data1) =>{
            if(errr){
                console.log("errr",errr); 
            }else{
                console.log("data1..",data1);
            }
        });
    } catch (e) {
        console.log("e..",e);
    }
}



const create = async (req,res,next) => {
    try {
        const params = {
                TableName : tableName,
                Item: req.body,
                ReturnValues: 'ALL_OLD',
        };
        
        let data = await dynamoClient.put(params).promise()
        console.log("da...",data);
        return res.status(200).json({msg : "Data Added Successfully...!"})
    } catch (e) {
        console.log("e..",e);
    }
}

const getAllProduct = async (req,res,next) =>{
    try {
        let params;
        const search = req.query.search;
        if(search){
            params = {
                TableName : tableName,
                FilterExpression: "contains (#name,:name_val) OR contains (#productId,:productId)",
                ExpressionAttributeNames:{
                    "#name":"name",
                    "#productId":"productId"
                },
                ExpressionAttributeValues:{
                    ":name_val" : search,
                    ":productId" : search
                }
            }
        }else{
            params = {
                TableName : tableName,
            }
        }
        
        const getdata = await dynamoClient.scan(params).promise();
        res.status(200).json(getdata)
    } catch (e) {
        console.log("e..",e);
    }
}

const updateProduct = async (req,res,next) =>{
    try {
        const productId = req.query.ID
        const params = {
            TableName : tableName,
            Item : {
                productId : productId,
                name : req.body.name
            }
        }
        await dynamoClient.put(params).promise()
        res.status(200).json({msg : "update Successfully...!"})
    } catch (e) {
        console.log("e..",e);
    }
}

const getProductById = async (req,res,next) =>{
    try {
        const productId = req.query.productId
        
        const params = {
            TableName : tableName,
            Key : {
                productId
            }
        }
        const getdata = await dynamoClient.get(params).promise();
        res.status(200).json(getdata)
    } catch (e) {
        console.log("e..",e);
    }
}

const deleteItem = async (req,res,next) =>{
    try {
        const productId = req.query.productId
        const params = {
            TableName : tableName,
            Key : {
                productId
            }
        }
        const deleteItem = await dynamoClient.delete(params).promise()
        res.status(200).json({msg : "delete item successfully..!"})
    } catch (e) {
        console.log("e..",e);
    }
}

const productUpdate = async  (req,res,next) => {
    try {
        const productId = req.query.productId
        const nameval= req.body.name

        var params = {
            TableName : tableName,
            Key : {
                "productId" : productId
            },
            UpdateExpression: 'set #name = :name_val',
            ExpressionAttributeNames:{
                '#name' : 'name'
            },
            ExpressionAttributeValues : {
                ":name_val" : nameval
            },
            ReturnValues: "UPDATED_NEW"
        };

        let data = await dynamoClient.update(params).promise()
        res.status(200).json(data.Attributes)
    } catch (e) {
        console.log("e...",e);
    }
}

module.exports = {
    create,
    getAllProduct,
    getProductById,
    updateProduct,
    deleteItem,
    productUpdate,
    getAdmin,
    updatePowerUserAccess,
    getUserFromPowerUser,
    updateUseCase,
    getUseCaseFromUser,
    createPowerUser,
    findUserAndcreatePowerUser,
    updateRoleInCognito
}