import { S3 } from "aws-sdk";
import fs from 'fs';
import path from 'path';


const s3 = new S3({
    accessKeyId:"",
    secretAccessKey:"",
    endpoint:""
})

export async function downloadS3Folder(prefix:string){
    console.log(prefix);
    const allFiles = await s3.listObjectsV2({
        Bucket: "vercel",
        Prefix: prefix,
    }).promise();

const allPromises = allFiles.Contents?.map(async ({Key}) => {
    return new Promise(async (resolve) => {
        if(!Key){
            resolve("");
            return;
        }
        const finalOutputPath = path.join(__dirname,Key);
        //createWriteStream -> write the data in the finalouputpath
        const outputFile = fs.createWriteStream(finalOutputPath);
        const dirName = path.dirname(finalOutputPath);
        if(!fs.existsSync(dirName)){
            fs.mkdirSync(dirName, {recursive: true});
        }

        //from S3 object copy the data to the ouput file 
        s3.getObject({
            Bucket: "vercel",
            Key
        }).createReadStream().pipe(outputFile).on("finish",()=>{
            resolve("");
        })
    })
}) || []

    await Promise.all(allPromises?.filter(x => x !== undefined));

};