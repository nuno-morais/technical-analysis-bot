import { Injectable } from '@nestjs/common';

@Injectable()
export class SymbolsApiService {
  getHello(): string {
    return 'Hello World!';
  }
}
