import { commandOptions, createClient } from "redis";
import { copyFinalDist, downloadS3Folder } from "./aws";
import { buildProject } from "./utils";
//In redis we can't  use one clinet to get and pubish data 
const subscriber = createClient();
subscriber.connect();

const publisher = createClient();
publisher.connect();

async function main(){
    while(1){
        const response = await subscriber.brPop(commandOptions({
            isolated: true
        }),
        'build-queue',
        0);
        
        //@ts-ignore
        const id = res.element

        await downloadS3Folder(`output/${id}`);
        await buildProject(id);
        copyFinalDist(id);
        publisher.hSet("status", id, "Deployed")
    }
}

main();