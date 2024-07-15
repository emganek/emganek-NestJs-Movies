import { HttpException, HttpStatus } from "@nestjs/common";

export class ForbiddenException extends HttpException {
  constructor() {
    super({message: 'Forbidden', customCode: 400001}, HttpStatus.FORBIDDEN);
  }
}