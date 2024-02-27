import  express from 'express';
import { S3 } from "aws-sdk";

const app = express();

const s3 = new S3({   
    accessKeyId: "",
    secretAccessKey: "",
    endpoint: ""
})

app.get('/*',async(req,res)=>{
    //extract the id => id.vercel.com
    const host = req.hostname; 
    const id = host.split(".")[0]; //['id', 'vercel', 'com'] => 0th index is the id
    
    const filePath = req.path;

    const contents = await s3.getObject({
        Bucket: "vercel",
        Key: `dist/${id}${filePath}`
    }).promise();

    //chekcing the file type
    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
    res.set("Content-Type", type);
    res.send(contents.Body);
})

app.listen(3001, ()=>{
    console.log('server is listening at port 3001')
})
