import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Delete, Put, Inject
} from '@nestjs/common';
import {ConsumeService} from "./consume.service";
import {ConfigService} from "@nestjs/config";
import * as querystring from 'querystring';
import {WINSTON_MODULE_PROVIDER} from "nest-winston";
import {Logger} from "winston";

@Controller('consume')
export class ConsumeController {

  constructor(
    private readonly consumeService: ConsumeService,
    private readonly config: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.restoreConsume();
  }

  async restoreConsume() {
    const callback_url = `${this.config.get('CONSUMER_WEBHOOK_HOST')}/consume`;

    return new Promise((resolve, reject) => {
      this.getWebhook(callback_url).then((res) => {
        if('exists' == res['status']) {
          this.logger.debug('webhook exists');
          // keep
          return resolve();
        } else if('not_found' === res['status']) {
          this.logger.debug('webhook does not exist');
          const modelData = {
            callback_url: callback_url
          };
          this.consumeService.addWebhook(modelData).then(resolve).catch(reject);
        }
      });
    });
  }

  async getWebhook(callback_url) {
    return new Promise((resolve, reject) => {
      this.consumeService.getWebhook(callback_url).then((res) => {
        return resolve({ status: 'exists' })
      }).catch((err) => {
        if(err.message.indexOf('not found') >= 0) {
          // keep
          return resolve({status: 'not_found'});
        }
        reject();
      });
    });
  }

  protected latestWebhookCallback = null;

  @Post()
  async getCallback(@Body() modelData): Promise<any> {
    this.latestWebhookCallback = modelData;
    console.log(modelData)
  }

  @Get()
  async getLatestWebhookCallback(@Body() modelData): Promise<any> {
    if(this.latestWebhookCallback) {
      return JSON.stringify(this.latestWebhookCallback);
    }
    return {};
  }


}
