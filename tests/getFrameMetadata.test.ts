import { getFrameMetadata } from "../src/core/getFrameMetadata";

describe('getFrameMetadata function', () => {
    it('generates button metadata for a Farcaster Frame', () => {
        const frameMetadata = getFrameMetadata({
            post_url: 'https://example.com/post',
            buttons: [
                { label: 'Click me', action: 'post'},
                { label: 'Button 2', action: "post_redirect"},
                { label: 'Button 3', action: "mint"},
                { label: 'Button 4', action: "post_redirect"},
            ],
            image: "https://gold-mere-anglerfish-964.mypinata.cloud/ipfs/QmTa2TnVpVrkQp8yjjF7ZYTtzYPwj2dgE6HAGxHYqzk6Da/cc.jpg",
        });
        const expectedMetadata = 
            `<meta name="fc:frame" content="vNext">\n` +
            `<meta name="og:image" content="https://gold-mere-anglerfish-964.mypinata.cloud/ipfs/QmTa2TnVpVrkQp8yjjF7ZYTtzYPwj2dgE6HAGxHYqzk6Da/cc.jpg">\n` +
            `<meta name="fc:frame:image" content="https://gold-mere-anglerfish-964.mypinata.cloud/ipfs/QmTa2TnVpVrkQp8yjjF7ZYTtzYPwj2dgE6HAGxHYqzk6Da/cc.jpg">\n` +
            `<meta name="fc:frame:button:1" content="Click me">\n`+
            `<meta name="fc:frame:button:1:action" content="post">\n`+
            `<meta name="fc:frame:button:2" content="Button 2">\n`+
            `<meta name="fc:frame:button:2:action" content="post_redirect">\n`+
            `<meta name="fc:frame:button:3" content="Button 3">\n`+
            `<meta name="fc:frame:button:3:action" content="mint">\n`+
            `<meta name="fc:frame:button:4" content="Button 4">\n`+
            `<meta name="fc:frame:button:4:action" content="post_redirect">\n` +
            `<meta name="fc:frame:post_url" content="https://example.com/post">\n`; 
        expect(frameMetadata).toEqual(expectedMetadata);
    });
    
    it('generates metadata for a Farcaster Frame with aspect ratio and buttons', () => {
        const frameMetadata = getFrameMetadata({
            image: "https://example.com/image.jpg",
            post_url: 'https://example.com/post',
            aspectRatio: "1:1",
            buttons: [
                { label: 'Button 1', action: 'post' },
                { label: 'Button 2', action: 'post_redirect' },
            ],
        });
        const expectedMetadata =
            `<meta name="fc:frame" content="vNext">\n` +
            `<meta name="og:image" content="https://example.com/image.jpg">\n` +
            `<meta name="fc:frame:image" content="https://example.com/image.jpg">\n` +
            `<meta name="fc:frame:aspectRatio" content="1:1">\n` +
            `<meta name="fc:frame:button:1" content="Button 1">\n` +
            `<meta name="fc:frame:button:1:action" content="post">\n` +
            `<meta name="fc:frame:button:2" content="Button 2">\n` +
            `<meta name="fc:frame:button:2:action" content="post_redirect">\n` +
            `<meta name="fc:frame:post_url" content="https://example.com/post">\n`; 
        expect(frameMetadata).toEqual(expectedMetadata);
    });
    
    it('generates metadata for a Farcaster Frame CID', () => {
        const frameMetadata = getFrameMetadata({
            post_url: 'https://example.com/post',
            cid: "QmTa2TnVpVrkQp8yjjF7ZYTtzYPwj2dgE6HAGxHYqzk6Da",
        });
        const expectedMetadata =
            `<meta name="fc:frame" content="vNext">\n` +
            `<meta name="og:image" content="https://undefined/ipfs/QmTa2TnVpVrkQp8yjjF7ZYTtzYPwj2dgE6HAGxHYqzk6Da">\n` +
            `<meta name="fc:frame:image" content="https://undefined/ipfs/QmTa2TnVpVrkQp8yjjF7ZYTtzYPwj2dgE6HAGxHYqzk6Da">\n` +
            `<meta name="fc:frame:post_url" content="https://example.com/post">\n`; 
        expect(frameMetadata).toEqual(expectedMetadata);
    });
});
