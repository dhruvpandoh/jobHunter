// npm install minimmist
// npm install axios
// npm instll excel4node

// node jobs.js --jobName=developer --mail='userMail@gmail.com'

// --jobName should be developer, graphic_designer because this is for limited keyword;

// Please provide yourGmail and gmail password in gmailCode section

// library to take input
let minimmist=require('minimist');
//library to read or write file
let fs=require('fs');
//library to make excel file
let excel=require('excel4node');
let jsdom=require('jsdom');
//library to download html
let axios=require('axios');
//library to send gmail
var nodemailer = require('nodemailer');

let arg=minimmist(process.argv);

let jobName=arg.jobName;

// read jobUrl.json file 
let jobRecord=fs.readFileSync("jobsUrl.json", "utf-8");

// convert json file to js object
jobRecord=JSON.parse(jobRecord);

let jobUrl=[]

for(let i=0; i<jobRecord.length; i++)
{
    if(jobName == jobRecord[i].Name)
    {
        for(let j=0; j<jobRecord[i].jobLink.length; j++)
        {
            jobUrl.push(jobRecord[i].jobLink[j].url);
        }    
        
        break;
    }
            
}



    // this code is used to download html form multiple website
/*
    for(let i=0; i<jobUrl.length; i++)
    {
        let link=jobUrl[i];
        let dwnload= axios.get(link);
        dwnload.then(function(response){
            downloadData = response.data;
            let name="file"+i+".html";
        fs.writeFileSync(name,downloadData, "utf-8");
        }).catch(function(err){
            console.log(err);
        })

    }
    
 */    

// this function job from flexjob website
function flexJob_com(dataFile,url)
{
    

    let document=dataFile.window.document;
    let record = document.querySelectorAll(".m-0.row.job  ");
    
    for(let i=0; i<record.length; i++)
    {
        let data={};
        let jobTitle=record[i].querySelector("a.job-title.job-link")
        data.jobTitle=jobTitle.textContent;

        let companyName="Not Disclose";
        data.companyName=companyName;

        let companyLocation = record[i].querySelector(".col.pr-0.job-locations.text-truncate");
        data.companyLocation=companyLocation.textContent;
        
        let salary="Not Disclose";
        data.salary=salary;

        data.ApplyLink=url;
        jobDetails.push(data);
    }

}

// this function fetch all job from inded
function inded_com(dataFile, url)
{
    let document =dataFile.window.document;

    let record=document.querySelectorAll(".jobCard_mainContent");
   
    for(let i=0; i<record.length; i++)
    {
        let data={};

        let jobTitle = record[i].querySelector("h2.jobTitle.jobTitle-color-purple > span");
        data.jobTitle=jobTitle.textContent;
        
        let companyName=record[i].querySelector(".companyName");
        data.companyName=companyName.textContent;
        
        let companyLocation=record[i].querySelector(".companyLocation");
        data.companyLocation=companyLocation.textContent;
       
        let salary =record[i].querySelector("div.metadata.salary-snippet-container");
        if(salary==null)
        {
            data.salary="Not Disclose";
         
        }else
        {
            data.salary=salary.textContent;
            
        }
        
        data.ApplyLink=url;
        jobDetails.push(data);
    }
    
}

let jobDetails=[];

for(let i=0; i<jobUrl.length; i++)
{
    let fileName="file"+i+".html";
    
    dataFile = fs.readFileSync(fileName, "utf-8");
    
    // convert jso to jsdom object
    dataFile = new jsdom.JSDOM(dataFile);
    
    if(i==0)
    {
        inded_com(dataFile, jobUrl[i]);
    }
    if(i==1)
    {
        flexJob_com(dataFile, jobUrl[i]);
    }
}


let recordInJson = JSON.stringify(jobDetails);

// write all scrap job in json file
fs.writeFileSync("jobDetails.json", recordInJson, "utf-8");

// read json file
let jobdata=fs.readFileSync("jobDetails.json", "utf-8");
jobdata=JSON.parse(jobdata);

// create excel file
let wb=new excel.Workbook();
let sheet=wb.addWorksheet("JOBS Details");
    sheet.cell(1,1).string("Job Title");
    sheet.cell(1,2).string("Company Name");
    sheet.cell(1,3).string("Company Location");
    sheet.cell(1,4).string("Salary");
    sheet.cell(1,5).string("Apply Link");
for(let i=0; i<jobdata.length; i++)
{
    let title = jobdata[i].jobTitle;
    let Name = jobdata[i].companyName;
    let loc = jobdata[i].companyLocation;
    let salary = jobdata[i].salary;
    let link = jobdata[i].ApplyLink;

    sheet.cell(2+i,1).string(title);
    sheet.cell(2+i,2).string(Name);
    sheet.cell(2+i,3).string(loc);
    sheet.cell(2+i,4).string(salary);
    sheet.cell(2+i,5).string(link);   
    
}

// write excel file
wb.write("jobRecord.csv");

// start gmail send code

var mail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kunwardigvijaysingh555@gmail.com',
      pass: 'd9416559956D'
    }
  });
  var mailOptions = {
    from: 'kunwardigvijaysingh555@gmail.com',
    to:    arg.mail,
    subject: 'Sending Email via Node.js',
    text: 'That was easy!',
    attachments: [{   // file on disk as an attachment
        filename: 'jobRecord.csv',
        path: 'E:/Web_Development/HackProject/jobRecord.csv' // stream this file
    },
    ]
  };
    
  mail.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

