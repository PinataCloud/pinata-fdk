import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";


export const dynamic = "force-dynamic";

export const config = {
  runtime: 'experimental-edge',
}

export default async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const message = searchParams.get("message") ?? "";
  
  // Get current date and time
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = currentDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex", // Use flex layout
          flexDirection: "row", // Align items horizontally
          alignItems: "stretch", // Stretch items to fill the container height
          width: "100%",
          height: "100vh", // Full viewport height
          backgroundColor: "black",
        }}
      >
        <img
          style={{
            height: "100%", // Make image full height
            objectFit: "cover", // Cover the area without losing aspect ratio
            width: "35%", // Image takes up 40% of the container's width
          }}
          src={`https://${process.env.PINATA_GATEWAY}/ipfs/QmR6vt6ufgABgHvXFPKc8p7GVSN3NGDZS7Bpe2ciAFokpV`}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            paddingLeft: 24,
            paddingRight: 24,
            lineHeight: 1.2,
            fontSize: 36,
            color: "white",
            flex: 1,
            overflow: "hidden",
            marginTop: 24,
          }}
        >
          <span style={{ fontSize: 32, marginLeft: 10, color: "white", marginBottom: 30 }}>{formattedDate} {formattedTime}</span>
          <div
            style={{
              color: "pink",
              fontSize: 72,
              marginBottom: 12,
              display: "flex"
            }}
          >
            <strong>Pinnie read...</strong> 
          </div>
          <div
            style={{
              display: "flex",
              overflow: "hidden",
            }}
          >
            &quot;{message}&quot; 
          </div>
          <div
            style={{
              color: "pink",
              fontSize: 72,
              marginBottom: 12,
              display: "flex"
            }}
          >
            <strong>Pinnie says...</strong>
          </div>
          <div
            style={{
              display: "flex",
              overflow: "hidden",
            }}
          >
            &quot;Thanks for your message &#x1F496; &#x1F48C; &#x1F49C;&quot;
          </div>
        </div>
        
      </div>
    ),
    {
      width: 1528,
      height: 800,
    }
  ); 
}
