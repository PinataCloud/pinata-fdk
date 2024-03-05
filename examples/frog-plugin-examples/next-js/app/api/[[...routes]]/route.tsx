/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { handle } from 'frog/next'
import { PinataFDK } from 'pinata-fdk'
import { config } from 'dotenv' 
config()


const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub API URL to enable frame verification.
  // hubApiUrl: "https://hub.pinata.cloud"
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

const fdk = new PinataFDK({ pinata_jwt: process.env.PINATA_JWT!, pinata_gateway: process.env.PINATA_GATEWAY! })
app.use("/", fdk.analyticsMiddleware({ frameId: "frog-next-example", customId: "frog-next-example-custom"}));


app.frame('/', (c) => {
  const { buttonValue, inputText, status } = c
  const fruit = inputText || buttonValue
  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {status === 'response'
            ? `Nice choice.${fruit ? ` ${fruit.toUpperCase()}!!` : ''}`
            : 'Welcome!'}
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter custom fruit..." />,
      <Button value="apples">Apples</Button>,
      <Button value="oranges">Oranges</Button>,
      <Button value="bananas">Bananas</Button>,
      status === 'response' && <Button.Reset>Reset</Button.Reset>,
    ],
  })
})

export const GET = handle(app)
export const POST = handle(app)
