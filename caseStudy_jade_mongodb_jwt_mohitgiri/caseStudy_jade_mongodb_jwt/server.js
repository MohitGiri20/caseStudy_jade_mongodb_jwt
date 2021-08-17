var MongoClient = require('mongodb').MongoClient
var express = require('express')
var jwt = require('jsonwebtoken')
var cors = require('cors')
var bodyParser = require('body-parser')

var url = "mongodb://127.0.0.1:27017/"
var mydb1 = "CustDB"
var mydb2 = "BooksDB"
var collection1 = "usercollection"
var collection2 = "bookcollection"
var app = express();

app.set("view engine","jade")
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({extended:true}));

const JWT_SECRET = 'kbfknkjneakjdnkjn jknfeqkjn f c jqebfejk vmnqbenbfwhebk fmn jk'

function get_token(obj){

    
    return jwt.sign(obj,JWT_SECRET)
}

function validate(t,pass){

    return jwt.verify(t,pass)

}

MongoClient.connect(url,function(err,db){
    if(err){
        throw err
    }
    dbo = db.db(mydb2)
    dbo1 = db.db(mydb1)
     console.log(dbo1)
    //  dbo1.createCollection(collection1,function(err,res){
    //     if(err) throw err
    //     console.log(res)
    //     console.log("Collection created")
    // })

    // app.post("/bookpage",(req,res)=>{
    //     dbo.collection(collection2).insertOne(req.body,function(err,result){
    //             if(err) throw err
    //             console.log(result)
    //             res.send("Record Inserted")
    //         })
    // })

    app.get("/",(req,res)=>{
        res.render("home.jade")
    })
    
    app.get("/login",(req,res)=>{
        res.render("login.jade")
    })
    
    app.get("/register",(req,res)=>{
        res.render("register.jade")
    })

    // app.get("/bookslist",(req,res)=>{
    //     res.render("bookslist.jade")
    // })

    app.get("/bookslist",(req,res)=>{
        dbo.collection(collection2).find({}).toArray(function(arr,result){
            res.render("bookslist",{bookresult:result})
        })
    })

    
    // app.post('/register',(req,res)=>{
    //     console.log(req.body) 
    //     res.send("Registered")
    // })

    app.post("/register",function(req,res){
        var userobject=req.body
        var token=get_token(userobject)
        console.log(token)
        var user = {
           "userobj" : userobject,
        "tok" :token,
         "username" : req.body.itemname }
        dbo1.collection(collection1).insertOne(user,function(err,result){
                        if(err) throw err
                        console.log(result)
                        res.send("Record Inserted into User database")
             })
        res.send({"token":token,secret:JWT_SECRET})
    })

    app.post("/login",function(req,res){
        //var t=req.body.token
        const{username,password} = req.body
        console.log(username + " " + password)
        dbo1.collection(collection1).find({username:username}).toArray(function(arr,result){   
            console.log(result)
            })
        var t = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpdGVtbmFtZSI6Im1vaGl0ZyIsInBhc3N3b3JkIjoiMTIzNDUiLCJpYXQiOjE2MjkyMjQyMDJ9.KPDlSGcUpxjqukheuPBnkGCqKUjjEYZvNFs43LL5ldQ"    
        var secret=JWT_SECRET
        var auth=validate(t,secret)
        console.log(auth)
      
        // var user = req.body;
        // console.log(user.itemname)
    })
    
    
    // app.post('/login',(req,res)=>{
    //     //  console.log(req.body)
    //     // res.send("LoggedIn")
    //     res.json({status:'ok',data : 'dssdasd'})
    // })
    
    // app.post("/bookpage",(req,res)=>{
    //     console.log(req.body)
    //     res.send("Book Details received")
    // })
    
     app.get("/bookpage",(req,res)=>{
            res.render("bookPage.jade")
        })
    // dbo.collection(collection2).find({}).toArray(function(arr,result){
    //             console.log(result)
    //         })


})


// app.get("/",(req,res)=>{
//     res.render("home.jade")
// })

// app.get("/login",(req,res)=>{
//     res.render("login.jade")
// })

// app.get("/register",(req,res)=>{
//     res.render("register.jade")
// })

// app.post('/register',(req,res)=>{
//     console.log(req.body) 
//     res.send("Registered")
// })


// app.post('/login',(req,res)=>{
//      console.log(req.body)
//     res.send("LoggedIn")
// })

// app.post("/bookpage",(req,res)=>{
//     console.log(req.body)
//     res.send("Book Details received")
// })

//  app.get("/bookpage",(req,res)=>{
//         res.render("bookPage.jade")
//     })
    // app.post("/bookpage",(req,res)=>{
    //     // dbo.collection(collection).insertOne(req.body,function(err,result){
    //     //         if(err) throw err
    //     //         console.log(result)
    //     //         res.send("Record Inserted")
    //     //     })
    //     console.log(req.body)
    // })



app.listen(3000,()=>{
    console.log("Started server")
})
