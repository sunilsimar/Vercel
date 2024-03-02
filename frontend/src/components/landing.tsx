import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import axios from "axios";

export function Landing(){
    const [repoUrl, setRepoUrl] = useState("");
    const [uploadId, setUploadId] = useState("");
    const [uploading, setUploading] = useState(false);
    const [deployed, setDeployed] = useState(false);

    return(
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
         <h1 className="text-3xl font-semibold font-sans text-gray-700 pb-10">Infinity Deployer</h1>
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-xl ">Deploy your Github Repository</CardTitle>
                <CardDescription>Enter the Url of your Github repository to deploy it</CardDescription>
            </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor = "github-url">Github Repository URL</Label>
                    <Input onChange={(e)=>{
                        setRepoUrl(e.target.value);
                    }}
                    placeholder="https://github.com/username/repo">
                    </Input>
                </div>
                <Button onClick={async()=>{
                    setUploading(true);
                    const res = await axios.post(`http://localhost:3000/deploy`,{
                        repoUrl: repoUrl
                    });
                    setUploadId(res.data.id);
                    setUploading(false);
                    const interval = setInterval(async()=>{
                        const respnose = await axios.get(`http://localhost:3000/status?id=${res.data.id}`);

                        if(respnose.data.status === 'deployed'){
                            clearInterval(interval);
                            setDeployed(true);
                        }
                    },3000);
                }} disabled={uploadId !== "" || uploading} className="w-full" type='submit'>
                    {uploadId ? `Deploying(${uploadId})`: uploading ? "Uploading..." : "Upload"}
                </Button>
            </div>
        </CardContent>
        </Card>
        {deployed && <Card className="w-full max-w-md mt-8">
            <CardHeader>
                <CardTitle className="text-xl">Deployment Status</CardTitle>
                <CardDescription>Your website is successffuly deployed by Infinity Deployer</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="deployed-url">Deployed URL</Label>
                        <Input id="deployed-url" readOnly type="url" value={`http://${uploadId}.dev.sunil.com:3001/index.html`}></Input>
                    </div>
                    <br/>
                    <Button className="w-full" variant={"outline"}>
                        <a href={`http://${uploadId}.sunil.com/index.html`} target="_blank">
                            Visit Website
                        </a>
                    </Button>
                </CardContent>
            </Card>}

            <footer className="text-center py-4 b">
  <p>Made with <span className="text-red-500">❤️</span> by Sunil</p>
  <span>
  <a href="https://github.com/sunilsimar/infinity-deployer" target="_blank" className="dipslay: inline-block">
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 1792 1792" fill="#000000">
      <path d="M1664 896q0 251-146.5 451.5T1139 1625q-27 5-39.5-7t-12.5-30v-211q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105T1386 856q0-121-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27T578 459.5 492 446q-44 113-7 204-79 85-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-40 36-49 103-21 10-45 15t-57 5-65.5-21.5T484 1274q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 89t.5 54q0 18-13 30t-40 7q-232-77-378.5-277.5T128 896q0-209 103-385.5T510.5 231 896 128t385.5 103T1561 510.5 1664 896z"></path>
    </svg>
  </a>
  <a href="https://www.linkedin.com/in/sunilsimar/" target="_blank" className="dipslay: inline-block">
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
<path fill="#0078d4" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5	V37z"></path><path d="M30,37V26.901c0-1.689-0.819-2.698-2.192-2.698c-0.815,0-1.414,0.459-1.779,1.364	c-0.017,0.064-0.041,0.325-0.031,1.114L26,37h-7V18h7v1.061C27.022,18.356,28.275,18,29.738,18c4.547,0,7.261,3.093,7.261,8.274	L37,37H30z M11,37V18h3.457C12.454,18,11,16.528,11,14.499C11,12.472,12.478,11,14.514,11c2.012,0,3.445,1.431,3.486,3.479	C18,16.523,16.521,18,14.485,18H18v19H11z" opacity=".05"></path><path d="M30.5,36.5v-9.599c0-1.973-1.031-3.198-2.692-3.198c-1.295,0-1.935,0.912-2.243,1.677	c-0.082,0.199-0.071,0.989-0.067,1.326L25.5,36.5h-6v-18h6v1.638c0.795-0.823,2.075-1.638,4.238-1.638	c4.233,0,6.761,2.906,6.761,7.774L36.5,36.5H30.5z M11.5,36.5v-18h6v18H11.5z M14.457,17.5c-1.713,0-2.957-1.262-2.957-3.001	c0-1.738,1.268-2.999,3.014-2.999c1.724,0,2.951,1.229,2.986,2.989c0,1.749-1.268,3.011-3.015,3.011H14.457z" opacity=".07"></path><path fill="#fff" d="M12,19h5v17h-5V19z M14.485,17h-0.028C12.965,17,12,15.888,12,14.499C12,13.08,12.995,12,14.514,12	c1.521,0,2.458,1.08,2.486,2.499C17,15.887,16.035,17,14.485,17z M36,36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698	c-1.501,0-2.313,1.012-2.707,1.99C24.957,25.543,25,26.511,25,27v9h-5V19h5v2.616C25.721,20.5,26.85,19,29.738,19	c3.578,0,6.261,2.25,6.261,7.274L36,36L36,36z"></path>
</svg>
</a>
</span>

</footer>
        </main>    
    )
}