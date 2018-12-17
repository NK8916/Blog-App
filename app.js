var express=require("express"),
    methodOverride=require("method-override"),
    mongoose=require("mongoose"),
    expressSanitizer=require("express-sanitizer"),
    bodyParser=require("body-parser");
    
var app=express();

mongoose.connect("mongodb://localhost/my_blog",{useNewUrlParser:true});

app.use(express.static("public"));

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(methodOverride("_method"));

app.use(expressSanitizer());

var blogSchema=mongoose.Schema({
    
    title:String,
    
    image:String,
    
    body:String,
    
    created:{type: Date,default: Date.now}
    
});

var Blog=mongoose.model("Blog",blogSchema);




app.get("/",function(req, res) {
    
    res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
    
    Blog.find({},function(err,blogs){
        
        if(err)
        {
            console.log(err);
            
        }
        
        else
        {
            
            res.render("index",{blogs:blogs});
            
        }
    });
    
    
    
});

app.get("/blogs/new",function(req, res) {
    
    
    res.render("new");
    
});


app.post("/blogs",function(req,res){
    
    req.body.blog.body=req.sanitize(req.body.blog.body);
    
    Blog.create(req.body.blog,function(err,blogs){
        
        if(err){
            
            console.log(err);
            
            res.render("new");
        }
        
        
         else
        {
            
        res.redirect("/blogs");    
            
        }
        
    });
    
});


app.get("/blogs/:id",function(req, res) {
    
    Blog.findById(req.params.id,function(err,foundblog){
        
        if(err)
        {
            res.redirect("/blogs/");
        }
        
        else{
            
            res.render("show",{blog:foundblog});
        }
        
    });
    
});


app.get("/blogs/:id/edit",function(req,res){
    
    Blog.findById(req.params.id,function(err, foundblog) {
        
    if(err){
        
        res.redirect("/blogs");
        
    }
        
        else{
            
            res.render("edit",{blog:foundblog});
            
        }
        
    });
    
});


app.put("/blogs/:id",function(req,res){
    
    req.body.blog.body=req.sanitize(req.body.blog.body);
    
    Blog.findOneAndUpdate(req.params.id,req.body.blog,function(err,updateblog){
        
        if(err){
            
        res.redirect("/blogs");    
        
        }
        
        else
        {
            res.redirect("/blogs/"+req.params.id);
            
        }
        
    });
    
    
    
});

app.delete("/blogs/:id",function(req,res){
    
    Blog.findOneAndDelete(req.params.id,function(err){
        
        if(err){
            
            res.redirect("/blogs");
        }
        
        else
        {
            res.redirect("/blogs");
        }
    });
    
   
    
});


app.listen(process.env.PORT,process.env.IP,function(){
    
    console.log("Listening");
    
    
});