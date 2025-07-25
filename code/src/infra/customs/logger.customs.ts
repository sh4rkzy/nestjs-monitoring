import { Logger } from '@nestjs/common';

export class CustomLogger extends Logger {
  setContext(context: string) {
    this.context = context;
  }
}
