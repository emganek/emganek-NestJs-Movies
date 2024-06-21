import { format, setSeconds } from 'date-fns';
import { DATE_FORMAT, TIME_STAMP_FORMAT } from '../constants/constants';
import { Between, FindOperator } from 'typeorm';

export class DateHelper {
  static convertToDatabaseFormat(date: string | Date): string {
    date = this.parseDate(date);

    return format(date, TIME_STAMP_FORMAT);
  }

  static parseDate(date: string | Date): Date {
    const result = typeof date === 'string' ? new Date(date) : date;

    if (result.toString() === 'Invalid Date') {
      throw new Error('Date value invalid');
    }

    return setSeconds(result,0);
    ;
  }

  static BetweenDatesQuery(
    from: Date | string,
    to: Date | string,
  ): FindOperator<string> {
    return Between(
      this.convertToDatabaseFormat(from),
      this.convertToDatabaseFormat(to),
    );
  }
}


export class Helper {
  static convertBufferToBase64(data: Buffer): string{
    return 'data:image/png;base64,' + data.toString('base64');
  }

  static parseBooleanStringToBoolean(data: string): boolean{
    return data === 'true';
  }
}