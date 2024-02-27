
# Farcaster Development Kit

An SDK to easily create Farcaster Frames, manage frame analytics and pin images to IPFS using Pinata. 

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
import { PinataFDK } from "pinata-fdk";
const fdk = new PinataFDK({
    pinata_jwt: "<YOUR_PINATA_JWT>",
    pinata_gateway: "<YOUR_PINATA_GATEWAY>"}, 
);
```
If you are only using the frame metadata functionality, you do not need to enter your credentials. 
```javascript 
import { PinataFDK } from "pinata-fdk";
const fdk = new PinataFDK();
```

## Usage

### `getFrameMetadata`

You can use this function to easily create the Farcaster specific metadata needed for your frame. 
**The only required input is `cid` or `image`.**

#### Params

- `buttons` - An array of button specifications (max 4). (Optional)
- `image` - A string for a valid hosted image url. 
- `cid` - A string representing the cid of an IPFS pinned image. 
- `input` - A string representing the text displayed for text input. (Optional)
- `post_url` - A string which contains a valid URL to send the Signature Packet to. (Optional)
- `refresh_period` - A string representing the refresh period for the image used. (Optional)
- `aspect_ratio` - A string representing the aspect ratio for the image used. (Optional)
- `state` - An object (e.g. JSON) representing the state data for the frame. (Optional) 
**Note:** state should only be included in response frames, not initial frames.

```javascript
type FrameHTMLType = {
  buttons?: [FrameButtonMetadata, ...FrameButtonMetadata[]]; 
  image?: {url: string};
  cid?: string;
  input?: FrameInputMetadata;
  post_url?: string;
  refresh_period?: number;
  aspect_ratio?: "1.91:1" | "1:1",
  state?: object
} & (
  { image: {url: string}}| { cid: string }
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

#### Example Code
```javascript
 const frameMetadata = fdk.getFrameMetadata({
    post_url: `<YOUR_DOMAIN>/api/test`,
    input: {text: "Hello, world!"},
    aspectRatio: "1.91:1",
    buttons: [
      { label: 'Click me', action: 'post'},
      { label: 'Button 2', action: "post_redirect"},
      { label: 'Button 3', action: "mint" },
      { label: 'Button 4', action: "link" },
    ],
    cid: "<YOUR_CID>", 
    state: {counter: 1}
  });
  ```
#### Response 
```javascript
<meta name="fc:frame" content="vNext">
<meta name="og:image" content="https://<YOUR_GATEWAY>/ipfs/<YOUR_CID>">
<meta name="fc:frame:image" content="https://<YOUR_GATEWAY>/ipfs/<YOUR_CID>">
<meta name="fc:frame:aspectRatio" content="1.91:1">
<meta name="fc:frame:input:text" content="Hello, world!">
<meta name="fc:frame:button:1" content="Click me">
<meta name="fc:frame:button:1:action" content="post">
<meta name="fc:frame:button:2" content="Button 2">
<meta name="fc:frame:button:2:action" content="post_redirect">
<meta name="fc:frame:button:3" content="Button 3">
<meta name="fc:frame:button:3:action" content="mint">
<meta name="fc:frame:button:4" content="Button 4">
<meta name="fc:frame:button:4:action" content="link">
<meta name="fc:frame:post_url" content="<YOUR_DOMAIN>/api/test">
<meta name="fc:frame:state" content="%7B%22counter%22%3A1%7D">
```

#### Images for `getFrameMetadata`
There are two different ways to set the images of your frame metadata. 

⚡️ Raw URL 

⚡️ CID


#### Raw URL
Specify a hosted url image link. 

```javascript
const frameMetadata = fdk.getFrameMetadata({
    image: { url: "<YOUR_URL>"}
  });
```

#### CID
Specify a CID from your Pinata account. 

```javascript
const frameMetadata = fdk.getFrameMetadata({
    cid: "QmX63EYiDk9cExrv4GDmZ5soJKkgqoUJv9LbtPyugLBtV2"
  });
  
//Must insert Pinata credentials when intializing SDK.    
```

### `convertUrlToIPFS`

Uploads an image to IPFS from a url. This url may be passed to the `getFrameMetadata` function.
#### Params

- `url` - A string for a valid hosted url image.

#### Example Code

```javascript 
 const ipfsUrl = await fdk.convertUrlToIPFS("https://example.com");
 const frameMetadata = fdk.getFrameMetadata({
    image: { url: ipfsUrl}
  });
```
#### Response
```javascript
https://<YOUR_GATEWAY>/ipfs/<YOUR_CID>
```


### `validateFrameMessage`

Returns a Promise that indicates wether a message signature is valid by querying Pinata's Farcaster hub. 

#### Params

- `body` - An object representing the raw payload of an action frame produced by Farcaster.
```
{
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
```
#### Example Code

```javascript 
const { isValid, message } = await fdk.validateFrameMessage(body);
```

#### Response
``` javascript
{
  isValid: true,
  message: {
    data: {
      type: 13,
      fid: 15974,
      timestamp: 98469569,
      network: 1,
      castAddBody: undefined,
      castRemoveBody: undefined,
      reactionBody: undefined,
      verificationAddAddressBody: undefined,
      verificationRemoveBody: undefined,
      userDataBody: undefined,
      linkBody: undefined,
      usernameProofBody: undefined,
      frameActionBody: [Object]
    },
    hash: <Buffer 46 f2 c3 eb ee 56 92 4f 14 47 2e f0 22 de 41 b6 26 52 a8 4d>,
    hashScheme: 1,
    signature: <Buffer 7a a0 5e b1 5a f9 59 a7 08 e9 d0 19 d2 24 47 f7 4b 15 d8 70 a8 fb 7e 36 f1 b6 06 14 c2 63 db 7f eb 98 4c 8a e7 98 5c 0d 72 27 04 f3 e9 19 08 10 e7 e9 ... 14 more bytes>,
    signatureScheme: 1,
    signer: <Buffer 1d 46 b7 63 1c 6f 15 7b 86 3a c1 9a 64 cd ba 7e b1 cc 2a cb 81 53 37 99 e8 69 e1 49 11 c4 81 4e>,
    dataBytes: undefined
  }
}
```

### `getAddressForFid`
Returns the connected Ethereum address for an FID.

#### Params

- `fid` - A number representing the fid of the user.

#### Example Code

```javascript 
const address = await fdk.getAddressForFid(15974);
```

#### Response
```
"0x9b7c18a71a98acd2f1271e2d1fe63750a70bc52b"
```

### `getUserByFid`
Returns the user datadata for an FID.

#### Params

- `fid` - A number representing the fid of the user.

#### Example Code

```javascript
const userData = await fdk.getUserByFid(20591);
```

#### Response

```
{
  fid: 20591,
  username: 'kyletut',
  pfp: 'https://i.imgur.com/TLMFnH6.jpg',
  bio: 'Everyone is from somewhere. Cofounder and CEO of Pinata. https://www.pinata.cloud/farcaster'
}
```

## Frame Analytics
To get started visit the [Integrations page](https://app.pinata.cloud/integrations) by clicking on the profile button in the top right, then selecting Integrations. 

*Note: You must have Warpcast integrated in the web app to use this functionality.*

In any of your POST endpoints for frames, you can send analytics like this:*

### `sendAnalytics`
Sends data to Pinata analytics for a specific frame.

#### Params

- `frame_data` - An object representing the raw payload of an action frame produced by Farcaster.
- `frame_id` - A string representing the frame you want to track.
- `custom_id`: A string representing a unique identifier to segment requests within the specified frame. (Optional)

#### Example Code

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
const custom_id = "my_custom_id"


await fdk.sendAnalytics(frame_id, frame_data, custom_id)
```

#### Response
```
{success: true}
```

After this is deployed you will see the analytics on the [Frame Analytics Page](https://app.pinata.cloud/frames-analytics). 


## Pin Files from CLI
### npx pin

Pin files directly from your `src` folder using the **pinata-fdk** `npx pin` command.

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

Check your `src/pins` folder for a  `pins_list.json` file. Here you can easily access your CID to input into `getFrameMetadata`.

