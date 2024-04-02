
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

## Farcaster Auth

The FDK makes it easy to give your Farcaster app write access for users so you can do things like sending casts or following other users. To get a better concept of the flow of Farcaster Auth, check out the guide [here](https://docs.pinata.cloud/farcaster/farcaster-auth).

### `createSigner`

This function will create a signer with Farcaster Auth, sign the key with your Farcaster App mnemonic phrase and FID, then send a request to Warpcast to register the signer. For more info on those please see [these docs](https://docs.pinata.cloud/farcaster/farcaster-auth#getting-started). 

In order to use it make sure the mnemonic and FID are included with the PinataFDK instance.

```typescript
import { PinataFDK } from "pinata-fdk"

const fdk = new PinataFDK({
  pinata_jwt: 'YOUR_PINATA_JWT',
  pinata_gateway: 'YOUR_GATEWAY',
  appFid: 'APP_FID',
  appMnemonic: 'APP_MNEMONIC'
})
```
#### Example
```typescript
import { PinataFDK } from "pinata-fdk"

const fdk = new PinataFDK({
  pinata_jwt: `${process.env.PINATA_JWT}`,
  pinata_gateway: "",
  appFid: `${process.env.APP_FID}`
  appMnemonic: `${process.env.FARCASTER_DEVELOPER_MNEMONIC}`
})

const signerData: WarpcastPayload = await fdk.createSigner() 
```

After creating the signer the user would visit the `signerData.deep_link_url` which would open Warpcast on their account to approve the signer. The user will have to pay warps since it is not sponsored.

#### Response

```typescript
{
  signer_id: "0873d8fe-4b87-427d-9e47-b312970929dc",
  token: "0xe3bffad26b16cf825f3d062d",
  deep_link_url: "farcaster://signed-key-request?token=0xe3bffad26b16cf825f3d062d",
  status: "pending_approval"
}
```

### `createSponsoredSigner`

Sponsored signers is very similar to `createSigner` except it does not require using your own Farcaster FID and mnemonic. Instead the key is created and signed by Pinata. You will still need to designate the `appFid` in your `PinataFDK` instance.

```typescript
import { PinataFDK } from "pinata-fdk"

const fdk = new PinataFDK({
  pinata_jwt: 'YOUR_PINATA_JWT',
  pinata_gateway: 'YOUR_GATEWAY',
  appFid: 'APP_FID',
})
```

#### Example

```typescript
import { PinataFDK } from "pinata-fdk"

const fdk = new PinataFDK({
  pinata_jwt: `${process.env.PINATA_JWT}`,
  pinata_gateway: "",
  appFid: `${process.env.APP_FID}`
})

const signerData: WarpcastPayload = await fdk.createSponsoredSigner() 
```

After creating the signer the user would visit the `signerData.deep_link_url` which would open Warpcast on their account to approve the signer. Since it is sponsored the user will not have to pay warps to sign in, however it will show Pinata as the app.

#### Response

```typescript
{
  signer_id: "9154bff0-96ed-4397-b8c1-4546eea48635",
  token: "0x21658c8fa560aca0f35a5e4a",
  deep_link_url: "farcaster://signed-key-request?token=0x21658c8fa560aca0f35a5e4a",
  status: "pending_approval"
}
```

### `pollSigner`

After creating a signer and giving the user the `deep_link_url` you will want to poll the signer to see if they have approved it and record the response to your account.

#### Params

`pollSigner` takes a parameter of `token` which is provided in either `createSigner` or `createSponsoredSigner`.

#### Example

```typescript
import { PinataFDK } from "pinata-fdk"

const fdk = new PinataFDK({
  pinata_jwt: `${process.env.PINATA_JWT}`,
  pinata_gateway: "",
  appFid: `${process.env.APP_FID}`
})

const pollData = await fdk.pollSigner("0x21658c8fa560aca0f35a5e4a") 
```

#### Returns

```typescript
{
  token: "0x321bbb927d9009232a7c26d6",
  deeplinkUrl: "farcaster://signed-key-request?token=0x321bbb927d9009232a7c26d6",
  key: "0x858e9ed1af97ec0c1cf06e7d769a2bca9ec324c152f320ee34b253af27b486f4",
  requestFid: 20918,
  state: "pending",
  isSponsored: false
}
```

### `getSigner`

After you have created a signer and it has been polled as complete, you can fetch the signer at any time using `getSigner`

#### Params

- fid - A number/integer of the FID you want to query. (Optional)

#### Example

```typescript
import { PinataFDK } from "pinata-fdk"

const fdk = new PinataFDK({
  pinata_jwt: `${process.env.PINATA_JWT}`,
  pinata_gateway: "",
  appFid: `${process.env.APP_FID}`
})

const pollData = await fdk.getSigner(6023) 
```
#### Returns

```typescript
{
  signers: [
    {
      id: 57,
      signer_uuid: "55e5d064-05d3-44c8-9825-992c51f81a48",
      fid: 6023,
      public_key: "dad973170c63739f7c812d188fab1df074eb1cd48facf6556e2ef9cbb76b4c18",
      signer_approved: true,
      revoked: false
    }
  ],
  next_page_token: "eyJvZmZzZXQiOiI1NyJ9"
}
```

## Frames

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
  action?: "post" | "post_redirect" | "mint" | "link" | "tx";
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

### Frog Analytics Plug-in 🐸

If you are using the Frog framework, you can utilize Pinata Frame analytics by importing our custom middleware function `analyticsMiddleware`. 

``` typescript
import { PinataFDK } from "pinata-fdk";
const fdk = new PinataFDK({
    pinata_jwt: "<YOUR_PINATA_JWT>",
    pinata_gateway: "<YOUR_PINATA_GATEWAY>"}, 
);

const app = new Frog({
  basePath: '/api',
  // hubApiUrl: "https://hub.pinata.cloud"
})

app.use("/", fdk.analyticsMiddleware({ frameId: "frame_id", customId: "custom_id"}));
```


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

