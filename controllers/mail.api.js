var express = require("express"),
router = express.Router();
//var serverpath="http://localhost:8000/"
var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var nodemailer = require('nodemailer');
var hogan = require('hogan.js')
var fs = require('fs');


var template = fs.readFileSync('static/newsletter.html', 'utf-8');
var compiledTemp = hogan.compile(template);
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yourmail',
    pass: 'yourpass'
  }
});
 var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });
var upload = multer({ //multer settings
    storage: storage,
    fileFilter : function(req, file, callback) { //file filter
                    if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                        return callback(new Error('Wrong extension type'));
                    }
                    callback(null, true);
                }
    }).single('file');
 /** API path that will upload the files */
router.post("/", function(req, res) {
        var exceltojson;
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                res.json({error_code:1,err_desc:"No file passed"});
                return;
            }
            /** Check the extension of the incoming file and 
             *  use the appropriate module
             */
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            console.log(req.file.path);
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders:true
                }, function(err,result){
                    if(err) {
                        return res.json({error_code:1,err_desc:err, data: null});
                    } 
                    else{
                        console.log(req.body.file)
                         res.send("Sending mails to all recipients");
                        for(var i = 0;i<result.length; i++){
                             console.log(result[i].emails)
                            var mailOptions = {
                                from: 'youremail@gmail.com',
                                to: result[i].emails,
                                subject: req.body.subject,
                                text: req.body.message,
                                html: compiledTemp.render()
                            };
                            transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                    console.log(error);
                                } 
                                else {
                                    
                                  }
                            }); 
                        }
                         fs.unlink(req.file.path,function(err){
                             if(err){
                                 console.log(err);
                             }
                         })
                        // res.send("Mails sent to recipients");
                    }
                   // res.json({error_code:0,err_desc:null, data: result});
                   
                });
            } catch (e){
                res.json({error_code:1,err_desc:"Corupted excel file"});
            }
        })
       
});

module.exports = router;