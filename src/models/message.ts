import { HttpStatus } from '@nestjs/common';

export class Message {
  customCode: number | undefined;
  message: string;
  status: HttpStatus = HttpStatus.OK;

  constructor(message: string, status?: HttpStatus, customCode?: number) {
    this.message = message;
    this.status = status ?? this.status;
    this.customCode = customCode ?? this.customCode;
  }
}
