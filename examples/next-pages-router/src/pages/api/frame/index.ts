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
    const frameMetadata = await fdk.getFrameMetadata({input: {text: "Send Pinnie a Valentine"}, buttons: [{label: "Send"}], cid: "QmYGS65BsDE7D4yw342GbGjF5LYgf73KnFXoYSwuSY7qL7", post_url: `${process.env.HOSTED_DOMAIN}/api/frame`,
  })
    const html = 
    `<!DOCTYPE html>
    <html lang="en">
      <head>
        ${frameMetadata}
      </head>
      <body>
        <div style="background: pink;">
          <h1>Send Pinnie a Valentine</h1>
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



