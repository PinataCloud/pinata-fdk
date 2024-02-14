// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {PinataFDK} from "pinata-fdk";

import type { NextApiRequest, NextApiResponse } from "next";
type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const fdk = new PinataFDK({
    pinata_jwt: process.env.PINATA_JWT!,
    pinata_gateway: process.env.PINATA_GATEWAY!
  },
  );
  // The GET request is the intial request to the frame from index.tsx.
  if (req.method === "GET") {
    try {
    const frameMetadata = await fdk.getFrameMetadata({input: {text: "Send Pinnie a Valentine"}, buttons: [{label: "Send"}], cid: "QmPsnQz3RCZvQZdjXQ1GQK6kJAMc289CCJr9DqS8MexUrU", post_url: `${process.env.HOSTED_DOMAIN}/api/frame`,
  })
    const html = 
    `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${frameMetadata}
        <title>Send Pinnie a Valentine</title>
        <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #800080; /* Purple background */
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 80 40"><text x="0" y="20" font-size="24">💗</text></svg>'); /* Pink heart */
            background-repeat: repeat;
        }
        .box {
            height: 300px;
            text-align: center;
            padding: 10px;
            animation: spin 20s linear infinite; /* Spin animation */
        }
        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
        h1 {
            color: #ff00ff; /* Pink text color */
        }
    </style>
      </head>
      <body>
      <div class="box">
        <img src=https://${process.env.PINATA_GATEWAY}/ipfs/QmPsnQz3RCZvQZdjXQ1GQK6kJAMc289CCJr9DqS8MexUrU alt="Valentine's Day Image" width="70%" height="auto">
      </div>
    </body>
      </html>`
    res.send(html);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  } 
  //  The POST request is recieved by the frame after the user interacts with the frame.
  else if (req.method === "POST") {
    try {
      const {
        untrustedData: { inputText },
      } = await req.body;
      //validate frame data
      const { isValid, message } = await fdk.validateFrameMessage(req.body);
      if(isValid){
          const frameMetadata = await fdk.getFrameMetadata({image: {url: `${process.env.HOSTED_DOMAIN}/api/image?message=${inputText}`}, buttons: [{label: "View Code", action: "post_redirect"}], post_url: `${process.env.HOSTED_DOMAIN}/api/frame/redirect`})
          const html = `<!DOCTYPE html>
          <html lang="en">
            <head>
              ${frameMetadata}
            </head>
            <body>
              </div>
            </body>
            </html>`
          res.send(html);
      }
      else{
        throw new Error("Frame message is not valid, message: " + message);
      }
      } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
      }

  }
}



