export default class CspService {
  private static instance: CspService;

  private constructor() {}

  public static getInstance(): CspService {
    if (!this.instance) {
      this.instance = new CspService();
    }
    return this.instance;
  }

  public initiateCsp() {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    const cspHeader = `
  default-src 'self';
  script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
  style-src 'self' 'nonce-${nonce}' fonts.googleapis.com;
  font-src 'self' fonts.gstatic.com;
  img-src 'self' data:;
  connect-src 'self' https://stingray-app-69yxe.ondigitalocean.app http://localhost:8000/api/ wss://ws.simplists.net https://fonts.googleapis.com 
  https://fonts.gstatic.com ws://localhost:3001/socket.io/;
  base-uri 'self';
  object-src 'none';
`;
    const contentSecurityPolicyHeaderValue = cspHeader
      .replace(/\s{2,}/g, " ")
      .trim();

    return { contentSecurityPolicyHeaderValue, nonce };
  }
}
