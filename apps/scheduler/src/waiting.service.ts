import { Injectable } from '@nestjs/common';

@Injectable()
export class WaitingService {
  public async wait(waitingTimeMs) {
    await new Promise((resolve) => setTimeout(resolve, waitingTimeMs));
  }
}
