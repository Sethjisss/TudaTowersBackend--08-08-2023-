const express=require('express')
const app=express()
const mysql = require("mysql");
//const mysql = require("mysql2");
const jwt = require('jsonwebtoken');
const cors=require("cors")
app.use(cors())
var moment = require('moment');
//var cron = require('node-cron');
const schedule = require('node-schedule');
//const twilio = require('twilio');
app.use(express.json({ limit: '50mb' }));
app.set('view engine', 'ejs');
var XMLHttpRequest = require('xhr2');
const bodyParser = require("body-parser");
const crypto=require("crypto");
const ccavService = require("./ccavenueService");

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();

const axios = require('axios');

//const sdk = require('api')('@msg91api/v5.0#171eja12lf0xqafw');
const port = process.env.PORT || 3000

var db_config = {
  host: "database-1.ctkhrdy7tksw.ap-south-1.rds.amazonaws.com",
  user: "TUDA",
  password: "WelcomeTUDA",
  database: "TOWERS_Prod",
  multipleStatements: true,
};
 //connection = mysql.createConnection(db_config);
var connection;
function handleDisconnect() {
  connection = mysql.createConnection(db_config); 
  connection.connect(function(err) {              
    if(err) {                                     
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); 
    }
    console.log("Successfully connected to the database.");                                     
  });                                     
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
      handleDisconnect();                         
    } else {                                      
      throw err;                                  
    }
  });
}

handleDisconnect();

// PG Way
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.post("/encrypt", (req, res) => {
  const payload = req.body;
  console.log(payload,"payload.....!")
  const data = {
    ...payload,
  };
  const encryptedData = ccavService.encrypt(data);
  console.log(encryptedData,"encryptedData.....!")
  if (encryptedData) {
    res.status(200).json({
      data: encryptedData,
      status: "SUCCESS",
    });
  } else {
    res.status(400).json({
      data: null,
      status: "FAILURE",
    });
  }
});

app.post("/handle-response", (req, res) => {
  const { encResp } = req.body;
  console.log(req.body,"encResp......");
  //console.log(req,"req......");
  const paymentStatus = ccavService.decrypt(encResp).responceCode;
  const teststatus = ccavService.decrypt(encResp);
  orderNoS = teststatus.data.order_id;
  orderAmountS = teststatus.data.amount;
  orderStatusS = teststatus.data.order_status;
  let TrnError = false;
  let order_id  = teststatus.data.order_id;
  let tracking_id = teststatus.data.tracking_id;
  let bank_ref_no = teststatus.data.bank_ref_no;
  let order_status = teststatus.data.order_status;
  let failure_message  =teststatus.data.failure_message;
  let payment_mode = teststatus.data.payment_mode;
  let card_name = teststatus.data.card_name;
  let status_code = teststatus.data.status_code;
  let status_message = teststatus.data.status_message;
  let currency = teststatus.data.currency;
  let amount = teststatus.data.amount;
  let billing_name = teststatus.data.billing_name;
  let billing_address = teststatus.data.billing_address;
  let billing_city = teststatus.data.billing_city;
  let billing_state = teststatus.data.billing_state;
  let billing_zip = teststatus.data.billing_zip;
  let billing_country  = teststatus.data.billing_country;
  let billing_tel = teststatus.data.billing_tel;
  let billing_email = teststatus.data.billing_email;
  let delivery_name = teststatus.data.delivery_name;
  let delivery_address  =teststatus.data.delivery_address;
  let delivery_city = teststatus.data.delivery_city;
  let delivery_state = teststatus.data.delivery_state;
  let delivery_zip = teststatus.data.delivery_zip;
  let delivery_country = teststatus.data.delivery_country;
  let delivery_tel = teststatus.data.delivery_tel;
  let merchant_param1 = teststatus.data.merchant_param1;
  let merchant_param2 = teststatus.data.merchant_param2;
  let merchant_param3 = teststatus.data.merchant_param3;
  let merchant_param4 = teststatus.data.merchant_param4;
  let merchant_param5 = teststatus.data.merchant_param5;
  let vault = teststatus.data.vault;
  let offer_type = teststatus.data.offer_type;
  let offer_code = teststatus.data.offer_code;
  let discount_value = teststatus.data.discount_value;
  let mer_amount = teststatus.data.mer_amount;
  let eci_value = teststatus.data.eci_value;
  let retry = teststatus.data.retry;
  let response_code = teststatus.data.response_code;
  let billing_notes = teststatus.data.billing_notes;
  let trans_date = teststatus.data.trans_date;
  let bin_country = teststatus.data.bin_country;

  connection.query(`INSERT INTO tudatowers_ordertracking_table (PaymentStatus, order_id, tracking_id, bank_ref_no, 
    order_status, failure_message, payment_mode, card_name, status_code, status_message,
    currency, amount,billing_name,billing_address, billing_city,billing_state,billing_zip, billing_country,billing_tel,
    billing_email, delivery_name,delivery_address,delivery_city, delivery_state,delivery_zip,delivery_country, delivery_tel,
    merchant_param1,merchant_param2,merchant_param3,merchant_param4,merchant_param5,vault,offer_type,offer_code,discount_value,
    mer_amount,eci_value,retry,response_code,billing_notes,trans_date,bin_country)
    VALUES ('${paymentStatus}','${order_id}','${tracking_id}','${bank_ref_no}','${order_status}','${failure_message}',
    '${payment_mode}','${card_name}','${status_code}','${status_message}','${currency}',
    '${amount}','${billing_name}','${billing_address}','${billing_city}','${billing_state}','${billing_zip}',
    '${billing_country}','${billing_tel}','${billing_email}','${delivery_name}','${delivery_address}','${delivery_city}',
    '${delivery_state}','${delivery_zip}','${delivery_country}','${delivery_tel}','${merchant_param1}','${merchant_param2}',
    '${merchant_param3}','${merchant_param4}','${merchant_param5}','${vault}','${offer_type}','${offer_code}','${discount_value}',
    '${mer_amount}','${eci_value}','${retry}','${response_code}','${billing_notes}','${trans_date}','${bin_country}')`,
   (err, result) => {
    if (err) {
      console.log("error: ", err);
      TrnError = true;
    }
  })

  const ord={
    "order_no":order_id,
    "reference_no":tracking_id
  }

  var m = crypto.createHash('md5');
	m.update("B59786A01F7126008C4CFBC80DB822C1");

	var key = m.digest();
	var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';

	var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
	var encoded = cipher.update(JSON.stringify(ord), 'utf8', 'hex');
	encoded += cipher.final('hex');

  let encRequestRes = encoded;
  console.log(encRequestRes,"encRequestRes......!")
  
  // axios.post(`https://api.ccavenue.com/apis/servlet/DoWebTrans?enc_request=${encRequestRes}&access_code=AVXQ87KG77AY14QXYA&request_type=JSON&response_type=JSON&command=orderStatusTracker&version=1.2`).then(res=>{
  axios.post(`https://apitest.ccavenue.com/apis/servlet/DoWebTrans?enc_request=${encRequestRes}&access_code=AVXQ87KG77AY14QXYA&request_type=JSON&response_type=JSON&command=orderStatusTracker&version=1.2`).then(res=>{
    console.log(res,"Enc complete res....!");
    console.log(res.data,"Enc res.data....!");
    var str = res.data,    
    delimiter = '=',
    start = 2,
    tokens = str.split(delimiter).slice(start),
    result = tokens.join(delimiter);     
    console.log(result,"result.....")
    if(result){
      var m = crypto.createHash('md5');
      m.update("B59786A01F7126008C4CFBC80DB822C1")
      var key = m.digest();
      
      var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
      var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
      var decoded = decipher.update(result, 'hex', 'utf8');
      decoded += decipher.final('utf8');
      console.log(decoded,"decoded result.....!")
      decodedresult = JSON.parse(decoded);
      console.log(decodedresult,"dcd res......!");
  
      let reference_no  = decodedresult.reference_no;      
      let order_no = decodedresult.order_no;
      let order_currncy = decodedresult.order_currncy;
      let order_amt = decodedresult.order_amt;
      let order_date_time  =decodedresult.order_date_time;
      let order_bill_name = decodedresult.order_bill_name;
      let order_bill_address = decodedresult.order_bill_address;
      let order_bill_zip = decodedresult.order_bill_zip;
      let order_bill_tel = decodedresult.order_bill_tel;
  
      let order_bill_email = decodedresult.order_bill_email;
      let order_bill_country = decodedresult.order_bill_country;
      let order_ship_name = decodedresult.order_ship_name;
      let order_ship_address = decodedresult.order_ship_address;
      let order_ship_country = decodedresult.order_ship_country;
      let order_ship_tel = decodedresult.order_ship_tel;
      let order_bill_city = decodedresult.order_bill_city;
      let order_bill_state  = decodedresult.order_bill_state;
      let order_ship_city = decodedresult.order_ship_city;
      let order_ship_state = decodedresult.order_ship_state;
      let order_ship_zip = decodedresult.order_ship_zip;
      let order_ship_email  =decodedresult.order_ship_email;
      let order_notes = decodedresult.order_notes;
      let order_ip = decodedresult.order_ip;
      let order_status = decodedresult.order_status;
      let order_fraud_status = decodedresult.order_fraud_status;
      let order_status_date_time = decodedresult.order_status_date_time;
      let order_capt_amt = decodedresult.order_capt_amt;
      let order_card_name = decodedresult.order_card_name;
      let order_delivery_details = decodedresult.order_delivery_details;
      let order_fee_perc = decodedresult.order_fee_perc;
      let order_fee_perc_value = decodedresult.order_fee_perc_value;
      let order_fee_flat = decodedresult.order_fee_flat;
      let order_gross_amt = decodedresult.order_gross_amt;
  
      let order_discount = decodedresult.order_discount;
      let order_tax = decodedresult.order_tax;
      let order_bank_ref_no = decodedresult.order_bank_ref_no;
      let order_gtw_id = decodedresult.order_gtw_id;
      let order_bank_response = decodedresult.order_bank_response;
      let order_option_type = decodedresult.order_option_type;
      let order_TDS = decodedresult.order_TDS;
      let order_device_type = decodedresult.order_device_type;
      let param_value1 = decodedresult.param_value1;
  
      let param_value2 = decodedresult.param_value2;
      let param_value3 = decodedresult.param_value3;
      let param_value4 = decodedresult.param_value4;
      let param_value5 = decodedresult.param_value5;
      let error_desc = decodedresult.error_desc;
      let status = decodedresult.status;
      let error_code = decodedresult.error_code;

      let User = decodedresult.param_value1;
      let BillNo = decodedresult.param_value2;
      let CurrentPaid = decodedresult.order_amt;
      let property = decodedresult.param_value3;

      connection.query(`INSERT INTO tudatowers_ordertrackingresult_table (reference_no, order_no, order_currncy, order_amt, 
        order_date_time, order_bill_name, order_bill_address, order_bill_zip, order_bill_tel, order_bill_email,
        order_bill_country, order_ship_name,order_ship_address,order_ship_country, order_ship_tel,order_bill_city,order_bill_state,
        order_ship_city,order_ship_state,order_ship_zip, order_ship_email,order_notes,order_ip,
        order_status,order_fraud_status,order_status_date_time, order_capt_amt,order_card_name,order_delivery_details,
        order_fee_perc,order_fee_perc_value,order_fee_flat,order_gross_amt,order_discount,order_tax,order_bank_ref_no,
        order_gtw_id,order_bank_response,order_option_type,order_TDS,order_device_type,param_value1,param_value2,
        param_value3,param_value4,param_value5,error_desc,status,error_code)
        VALUES ('${reference_no}','${order_no}','${order_currncy}','${order_amt}','${order_date_time}','${order_bill_name}',
        '${order_bill_address}','${order_bill_zip}','${order_bill_tel}','${order_bill_email}','${order_bill_country}',
        '${order_ship_name}','${order_ship_address}','${order_ship_country}','${order_ship_tel}','${order_bill_city}','${order_bill_state}',
        '${order_ship_city}','${order_ship_state}','${order_ship_zip}','${order_ship_email}','${order_notes}','${order_ip}',
        '${order_status}','${order_fraud_status}','${order_status_date_time}','${order_capt_amt}','${order_card_name}','${order_delivery_details}',
        '${order_fee_perc}','${order_fee_perc_value}','${order_fee_flat}','${order_gross_amt}','${order_discount}','${order_tax}','${order_bank_ref_no}',
        '${order_gtw_id}','${order_bank_response}','${order_option_type}','${order_TDS}','${order_device_type}','${param_value1}',
        '${param_value2}','${param_value3}','${param_value4}','${param_value5}','${error_desc}','${status}','${error_code}')`,
       (err, result2) => {
        if (err) {
          console.log("error: ", err);
          TrnError = true;
        }
        else{                
          if (paymentStatus === "Success"){
            console.log("paymentStatus...Success.....!")
          }
        }
      })
    }
  })
  setTimeout(()=>{
    if(TrnError){
      res.render('failure');    
    }else{
      res.render('success',{data : orderNoS,data2 : orderAmountS,data3 : orderStatusS});
    }
  },5000)

});

// Login

app.post('/userlogin',(req,res)=>{  
  connection.query(
    `Select * from tudatowers_userlogin_table where USER_NAME='${req.body.username}' and PASSWORD='${req.body.password}'`,
    function (err, data, fields) {
      if (err){
        res.status(500).json({
          "status":500,
          message: "Something went wrong...",
        });
      console.log(err)
      }else{
       if(data.length>0){
        let jwtSecretKey = "SSS@tuda_2023";
        let val = {
            time: Date(),
            userId: req.body.username,
        }  
        const token = jwt.sign(val, jwtSecretKey);  
        res.status(200).json({
          "status":200,
          message: "User Logged In...",
          token:token
        });
       }else{
        res.status(201).json({
          "status":201,
          message: "Invalid Credentials",
        });
       }
       
      }
     
    }
  );
})

// Tuda Towers

app.post("/tudatowersregistration",(req,res)=>{
let AADHAAR = req.body.AADHAAR;
let USER_NAME = req.body.USER_NAME;
let MOBILE_NUM = req.body.MOBILE_NUM;
let PAN = req.body.PAN;
let EMAIL = req.body.EMAIL;
let INTERESTED_IN = req.body.INTERESTED_IN;
let STATUS = null;

let query= connection.query(`INSERT INTO tudatowers_registration_table (USER_NAME, MOBILE_NUM,
  AADHAAR, PAN, INTERESTED_IN, EMAIL, STATUS)
 VALUES ('${USER_NAME}','${MOBILE_NUM}','${AADHAAR}','${PAN}','${INTERESTED_IN}',
 '${EMAIL}','${STATUS}')`,
 (err,result)=>{

   console.log(query,"query")
     if(err) {
       console.log(err)
     }else{
     return res.json({
         "message":"Saved Successfully",
         "status":200
       })
     }

    
 })

}
)

app.get("/tudatowerscounter",(req,res)=>{
connection.query(`CALL tuda_towers_counter_proc()`,(err,result)=>{
  if(err){
    console.log(err)
  }else{
    return res.json({
      "message":"Retrieved Successfully",
      "status":200
    })
  }
})
}
)

app.get("/tudatowersviewcounts",(req,res)=>{
connection.query(`SELECT * FROM tuda_towers_counter_table`, (err, result) => {
  if (err) {
    console.log("error: ", err);
    return false;
  }   
  res.json(result)
  //console.log(result);
})
})

app.get("/tudatowersdistinctcount",(req,res)=>{
  connection.query(`SELECT INTERESTED_IN, count(INTERESTED_IN) AS Total FROM tudatowers_registration_table GROUP BY INTERESTED_IN`, (err, result) => {
    if(err){
      console.log("error: ",err);
      return false;
    }
    res.json(result)
  })
})


app.post("/savelocation", (req, res) => {
  const { city, ip_address, region, country, postal_code } = req.body;
  //console.log(req.body, "reqbody");
  const sql =
    "INSERT INTO tudatowers_geolocation_table (CITY, IP,REGION,COUNTRY,POSTAL_CODE) VALUES (?, ?,?,?,?)";
    connection.query(
    sql,
    [city, ip_address, region, country, postal_code],
    (err, result) => {
      if (err) {
        res.status(500).send("An error occurred while creating a record");
      } else {
        res.status(201).send("Record created successfully");
      }
    }
  );
});


app.get("/getgeolocation", (req, res) => {
  const sql = "SELECT * FROM tudatowers_geolocation_table";
  connection.query(sql, (err, results) => {
    //console.log(sql, "get");
    if (err) {
      console.error("Error executing MySQL query:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      return res.json(results);
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  });
});

app.get("/getallotmentdetails/:UserName",(req,res)=>{
  //console.log(req.params,"req.params....!")
  let UserName = req.params.UserName;
  //console.log(UserName,"UserName....!")
  connection.query(`SELECT * FROM TOWERS_Prod.tudatowers_sold_flats_details_table
WHERE REFRENCE_ID='${UserName}' ;`,(err,result)=>{
  if (err) {
      console.log("error: ", err);
      return false;
    }   
    res.json(result)
})
})

app.get("/getallotmentdetailsP/:UserName",(req,res)=>{
  //console.log(req.params,"req.params....!")
  let UserName = req.params.UserName;
  //console.log(UserName,"UserName....!")
  connection.query(`SELECT * FROM TOWERS_Prod.tudatowers_property_payment_table
WHERE REFRENCE_ID='${UserName}' ;`,(err,result)=>{
  if (err) {
      console.log("error: ", err);
      return false;
    }   
    res.json(result)
})
})

app.get("/getuserdata/:UserName",(req,res)=>{
  let UserName = req.params.UserName;
  connection.query(`SELECT * FROM TOWERS_Prod.tudatowers_sold_flats_details_table WHERE REFRENCE_ID='${UserName}'`,(err,result)=>{
    if(err){
      console.log("Error :",err);
      return false;
    }else{
      res.json(result);
    }
  })
})



 app.listen(port)