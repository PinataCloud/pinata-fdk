import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";

export const dynamic = "force-dynamic";

export const config = {
  runtime: 'experimental-edge',
}

export default async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const message = searchParams.get("message") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <img
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
          src={`https://${process.env.PINATA_GATEWAY}/ipfs/QmUANg1yx46DaQRiFpjzHHWuxvzqfzV7XSHN4fWRXc6Go8`}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "purple",
            fontSize: "40px",
            padding: "20px",
            borderRadius: "8px",
            fontFamily: "sans-serif",
            width: "60%",
            wordBreak: "break-word",
          }}
        >
          {message}
        </div>
      </div>
    ),
    {
      width: 1528,
      height: 800,
    }
  ); 
}
