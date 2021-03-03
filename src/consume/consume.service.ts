import {ConfigService} from "@nestjs/config";
import {Inject, Injectable} from "@nestjs/common";
import axios from 'axios';
import {WINSTON_MODULE_PROVIDER} from "nest-winston";
import {Logger} from "winston";

@Injectable()
export class ConsumeService {

  constructor(
    private readonly config: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {

  }

  async getWebhook(callback_url) {
    return new Promise((resolve, reject) => {
      this.logger.debug('get webhook');
      axios
        .get(`${this.config.get('WEBHOOK_API_HOST')}/webhook/${callback_url}`)
        .then((res: any) => {
          this.logger.debug(`received statusCode: ${res.status}`);
          resolve();
        }).catch((err) => {
          if (err.response && err.response.data) {
            return reject(new Error(err.response.data.message));
          }
          return reject(new Error('bad request'));
      })
    });
  }

  async addWebhook(modelData) {
    return new Promise((resolve, reject) => {
      this.logger.debug('add webhook');
      axios
        .post(`${this.config.get('WEBHOOK_API_HOST')}/webhook`, modelData)
        .then((res: any) => {
          this.logger.debug(`received statusCode: ${res.status}`);
          resolve();
        })
        .catch(error => {
          console.error(error);
          reject();
        })
    });
  }
}
