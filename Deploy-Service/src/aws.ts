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

    //key is - output/123/src/index.js
const allPromises = allFiles.Contents?.map(async ({Key}) => {
    return new Promise(async (resolve) => {
        if(!Key){
            resolve("");
            return;
        }
        const finalOutputPath = path.join(__dirname,Key); //dist/output/123/src/index.js

        const dirName = path.dirname(finalOutputPath);  //returns dist/output/123/src/index.js

        if(!fs.existsSync(dirName)){
            fs.mkdirSync(dirName, {recursive: true});
        }

        //createWriteStream -> write the data in the finalouputpath
        const outputFile = fs.createWriteStream(finalOutputPath);

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

//after building the project which is pull from S3 now uploading the build process to s3
export function copyFinalDist(id: string){
    const folderPath = path.join(__dirname, `output/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach(file => {
        uploadFile(`dist/${id}` + file.slice(folderPath.length + 1), file)
    })
}

    const getAllFiles = (folderPath: string) => {
        let response:string[] = [];
    
        const allFilesAndFolders = fs.readdirSync(folderPath);
        allFilesAndFolders.forEach(file=>{
            const fullFilePath = path.join(folderPath,file);
            if(fs.statSync(fullFilePath).isDirectory()){
                response = response.concat(getAllFiles(fullFilePath))
            } else{
                response.push(fullFilePath);
            }
        });
        return response;
    }

    const uploadFile = async (fileName: string, localFilePath: string) => {
        const fileContent = fs.readFileSync(localFilePath);
        const response = await s3.upload({
            Body: fileContent,
            Bucket: "vercel",
            Key: fileName,
        }).promise();
        console.log(response);
    }