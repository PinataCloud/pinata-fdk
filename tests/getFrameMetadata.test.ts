import { FrameHTMLType, PinataConfig } from "../src";
import { getFrameMetadata } from "../src/core/getFrameMetadata";


describe('getFrameMetadata function', () => {
  it('should generate correct metadata with optional parameters', () => {
    const frameDetails: FrameHTMLType = {
      image: {
        url: 'https://example.com/image.jpg',
      },
      input: {
        text: 'Input text',
      },
      buttons: [
        { label: 'Button 1', action: 'post', target: '_blank' },
        { label: 'Button 2', action: 'post_redirect' },
      ],
      aspect_ratio: '1:1',
      post_url: 'https://example.com/post',
      refresh_period: 60,
      state: { key: 'value' },
    };
    const config: PinataConfig = {
     pinata_jwt: 'Bearer <your-jwt>',
      pinata_gateway: 'https://gateway.pinata.cloud',
    };
    const metadata = getFrameMetadata(frameDetails, config);
    expect(metadata).toContain('<meta name="fc:frame" content="vNext">\n');
    expect(metadata).toContain('<meta name="og:image" content="https://example.com/image.jpg">\n');
    expect(metadata).toContain('<meta name="fc:frame:image" content="https://example.com/image.jpg">\n');
    expect(metadata).toContain('<meta name="fc:frame:input:text" content="Input text">\n');
    expect(metadata).toContain('<meta name="fc:frame:button:1" content="Button 1">\n');
    expect(metadata).toContain('<meta name="fc:frame:button:1:action" content="post">\n');
    expect(metadata).toContain('<meta name="fc:frame:button:1:target" content="_blank">\n');
    expect(metadata).toContain('<meta name="fc:frame:button:2" content="Button 2">\n');
    expect(metadata).toContain('<meta name="fc:frame:button:2:action" content="post_redirect">\n');
    expect(metadata).toContain('<meta name="fc:frame:image:aspect_ratio" content="1:1">\n');
    expect(metadata).toContain('<meta name="fc:frame:post_url" content="https://example.com/post">\n');
    expect(metadata).toContain('<meta name="fc:frame:refresh_period" content="60">\n');
    expect(metadata).toContain('<meta name="fc:frame:state" content="%7B%22key%22%3A%22value%22%7D">\n'); // URL encoded JSON string
  });
});
