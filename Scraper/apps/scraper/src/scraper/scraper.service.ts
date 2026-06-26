import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);
  private readonly agent: HttpsProxyAgent<string> | undefined;

  constructor(private readonly config: ConfigService) {
    const proxyUrl = this.config.get<string>('PROXY_URL');
    if (proxyUrl) {
      this.agent = new HttpsProxyAgent(proxyUrl);
      this.logger.log(`Proxy enabled: ${proxyUrl}`);
    }
  }

  async fetchHtml(url: string): Promise<string> {
    const response = await axios.get<string>(url, {
      responseType: 'text',
      timeout: 30_000,
      httpsAgent: this.agent,
      httpAgent: this.agent,
    });
    return response.data;
  }
}
