const express = require('express');
const { PinataFDK } = require('pinata-fdk');
const app = express();
require('dotenv').config();
  
const fdk = new PinataFDK({pinata_jwt: process.env.PINATA_JWT, pinata_gateway: process.env.PINATA_GATEWAY});

app.use(express.json())

app.get('/', (req, res) => {
  const frameMetadata = fdk.getFrameMetadata({
    buttons: [{label: "Get Started"}], 
    cid: "QmQLhEwkN5b8QiWBFVnNq1nrHeJTue3nDRtXFJDND5YrM1", 
    post_url: `${process.env.HOSTED_DOMAIN}/intialize`
  })
  const html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        ${frameMetadata}
      </head>
      <body>
        <h1>Express Example with pinata-fdk</h1>
      </body>
      </html>`
    res.send(html);
    }
);


app.post('/intialize', async (req, res) => {
  const messageRes = await fdk.validateFrameMessage(req.body);
  const frameMetadata = fdk.getFrameMetadata({
    buttons: [{label: "Next Step"}], 
    cid: "Qmdx9WGFHyaoi1MbzFhJP4QW9aGLTBUxbtuWz9GUU9Gj2M", 
    post_url: `${process.env.HOSTED_DOMAIN}/step2`
  })
  const html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      ${frameMetadata}
    </head>
    <body>
    </body>
    </html>`
  if(messageRes.isValid){
      const analyticsRes = await fdk.sendAnalytics("express_frame", req.body)
      if(analyticsRes.success){
        res.send(html);
      }
      else{
        res.status(500).send("Frame analytics failed.")
      }
  }
  else{
    res.status(500).send("Frame request validation failed.")
  }
});


app.post('/step2', async (req, res) => {
  const messageRes = await fdk.validateFrameMessage(req.body);
  const frameMetadata = fdk.getFrameMetadata({
    buttons: [{label: "Next Step"}], 
    cid: "QmbuKjs9wjPj63PLEtBwBCo7WYAYQZ2LFck5ZyHuoaLaaJ", 
    post_url: `${process.env.HOSTED_DOMAIN}/step3`
  })
  const html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      ${frameMetadata}
    </head>
    <body>
      <h1>Express Example with pinata-fdk</h1>
    </body>
    </html>`
  if(messageRes.isValid){
      const analyticsRes = await fdk.sendAnalytics("express_frame", req.body)
      if(analyticsRes.success){
        res.send(html);
      }
      else{
        res.status(500).send("Frame analytics failed.")
      }
  }
  else{
    res.status(500).send("Frame request validation failed.")
  }
});

app.post('/step3', async (req, res) => {
  const messageRes = await fdk.validateFrameMessage(req.body);
  const frameMetadata = fdk.getFrameMetadata({
    buttons: [{label: "View Source Code", action: "post_redirect"}], 
    cid: "QmbuKjs9wjPj63PLEtBwBCo7WYAYQZ2LFck5ZyHuoaLaaJ", 
    post_url: `${process.env.HOSTED_DOMAIN}/redirect`
  })
  const html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      ${frameMetadata}
    </head>
    <body>
      <h1>Express Example with pinata-fdk</h1>
    </body>
    </html>`
  if(messageRes.isValid){
      const analyticsRes = await fdk.sendAnalytics("express_frame", req.body)
      if(analyticsRes.success){
        res.send(html);
      }
      else{
        res.status(500).send("Frame analytics failed.")
      }
  }
  else{
    res.status(500).send("Frame request validation failed.")
  }
});

app.post('/redirect', async (req, res) => {
  const messageRes = await fdk.validateFrameMessage(req.body);
  if(messageRes.isValid){
      const analyticsRes = await fdk.sendAnalytics("express_frame", req.body)
      if(analyticsRes.success){
        res.redirect("https://github.com");
      }
      else{
        res.status(500).send("Frame analytics failed.")
      }
  }
  else{
    res.status(500).send("Frame request validation failed.")
  }

})

app.listen(3000, () => console.log('Example app is listening on port 3000.'));


