
# Pinata FDK

An SDK to easily create Farcaster Frames, manage frame analytics and pin images to IPFS using Pinata. 
<br> 
<br>
View the full documentation [here](https://docs.pinata.cloud/farcaster/fdk). 

## Getting Started

### Installation
```javascript
npm i pinata-fdk
```
```javascript
yarn add pinata-fdk
```

### Initialization

If you want to leverage IPFS pinning capabilities, you must enter your Pinata JWT and a Pinata gateway during intialization. 
```javascript
import {PinataFDK} from "pinata-fdk";
const fdk = new PinataFDK({
    pinata_jwt: "YOUR_PINATA_JWT",
    pinata_gateway: "YOUR_PINATA_GATEWAY"}, 
    //do not include https:// in your gateway url
);
```
If you are only using the frame metadata functionality, you do not need to enter your credentials. 
```javascript 
import {PinataFDK} from "pinata-fdk";
const fdk = new PinataFDK();
```

## Usage/Examples

## getFrameMetadata()
You can use this funcion to easily create the metadata needed for your Farcaster Frame. 
The only required input is `cid` or `image`

### Input Types
```javascript
type FrameHTMLType = {
  buttons?: [FrameButtonMetadata, ...FrameButtonMetadata[]];
  image?: {url: string, ipfs?: boolean};
  cid?: string;
  input?: FrameInputMetadata;
  post_url?: string;
  refresh_period?: number;
  aspect_ratio?: "1.91:1" | "1:1" 
} & (
  { image: {url: string, ipfs?: boolean}} | { cid: string }
);
```
```javascript 
type FrameButtonMetadata = {
  label: string;
  action?: "post" | "post_redirect" | "mint" | "link";
  target?: string;
}
```
```javascript 
type FrameInputMetadata = {
    text: string;
};

```

### Example Input
```javascript
 const frameMetadata = await fdk.getFrameMetadata({
    post_url: `your_domain/api/test`,
    input: {text: "Hello, world!"},
    aspect_ratio: "1.91:1",
    buttons: [
      { label: 'Click me', action: 'post'},
      { label: 'Button 2', action: "post_redirect"},
      { label: 'Button 3', action: "mint" },
      { label: 'Button 4', action: "link" },
    ],
    cid: "YOUR_CID"
  });
  ```
### Example Output
```javascript
<meta name="fc:frame" content="vNext">
<meta name="og:image" content="https://YOUR_GATEWAY/ipfs/YOUR_CID">
<meta name="fc:frame:image" content="https://YOUR_GATEWAY/ipfs/YOUR_CID">
<meta name="fc:frame:aspect_ratio" content="1.91:1">
<meta name="fc:frame:input:text" content="Hello, world!">
<meta name="fc:frame:button:1" content="Click me">
<meta name="fc:frame:button:1:action" content="post">
<meta name="fc:frame:button:2" content="Button 2">
<meta name="fc:frame:button:2:action" content="post_redirect">
<meta name="fc:frame:button:3" content="Button 3">
<meta name="fc:frame:button:3:action" content="mint">
<meta name="fc:frame:button:4" content="Button 4">
<meta name="fc:frame:button:4:action" content="link">
<meta name="fc:frame:post_url" content="your_domain/api/test">
```

### Images for Frame Metadata
There are three different ways to set the images of your frame metadata. 

⚡️ IPFS Upload

⚡️ Raw URL 

⚡️ CID


###  IPFS Uploads
```javascript
const frameMetadata = await fdk.getFrameMetadata({
    image: { url: "your_image_url", ipfs: true}
  });

//Must insert Pinata credentials when intializing SDK.  
```
### Raw URL

```javascript
const frameMetadata = await fdk.getFrameMetadata({
    image: { url: "your_image_url", ipfs: false}
  });
``` 
### CID
```javascript
const frameMetadata = await fdk.getFrameMetadata({
    cid: "QmX63EYiDk9cExrv4GDmZ5soJKkgqoUJv9LbtPyugLBtV2"
  });
  
//Must insert Pinata credentials when intializing SDK.    
```

## validateFrameMessage()

Returns a Promise that indicates wether a message signature is valid, by querying Pinata's Farcaster hub. 

```javascript 
const body = await request.json();
const { isValid, message } = await fdk.validateFrameMessage(body);

```

## Frame Analytics
If you'd like to track the interactions your frame(s) receive over time, you can send analytics data that is made available on a dashboard inside your Pinata account. 
<br> 
<br>
To get started visit the [Integrations Page](https://app.pinata.cloud/integrations?_gl=1*sa853s*_ga*MTg2MDc4ODc4MS4xNzA4MDEzNDQw*_ga_5RMPXG14TE*MTcwODExMjIwNS43LjEuMTcwODExNjY2NC44LjAuMA..#iss=https%3A%2F%2Fauth.pinata.cloud%2Frealms%2Fpinata) page by clicking on the profile button in the top right, then selecting Integrations. Note: You will need Warpcast installed on your phone to sign in. 

![Analytics dashboard](https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmfNvYKNHLFut99TRmwVAhKa1ePUoeqpgB61rxfzdoM5zq)

In any of your POST endpoints for frames, you can send analytics like this: 

```javascript
// This should be the raw payload from the frame action
const frame_data = {
  untrustedData: {
    fid: 2,
    url: "https://fcpolls.com/polls/1",
    messageHash: "0xd2b1ddc6c88e865a33cb1a565e0058d757042974",
    timestamp: 1706243218,
    network: 1,
    buttonIndex: 2,
    inputText: "hello world", // "" if requested and no input, undefined if input not requested
    castId: {
      fid: 226,
      hash: "0xa48dd46161d8e57725f5e26e34ec19c13ff7f3b9",
    },
  },
  trustedData: {
    messageBytes: "d2b1ddc6c88e865a33cb1a565e0058d757042974...",
  },
};
const frame_id = "my-unique-frame-name"

await fdk.sendAnalytics(frame_id, frame_data)
```

## Pin Files from CLI
### npx pin

Pin files directly from your `src` folder using the `pinata-fdk`  **npx pin** command.

Create a `pins` folder located under your `src` folder

```jsx
src
-pins/
```

Add any images you want uploaded to IPFS! 

```jsx
src
-pins/
--image.png
```

Run the command:

```jsx
npx pin <YOUR_PINATA_JWT>
```

Check your `src/pins` folder for a  `pins_list.json` file. Here you can easily access your CID to input into `getFrameMetadata().`
