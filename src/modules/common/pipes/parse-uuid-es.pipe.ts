import { ParseUUIDPipe, BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ParseUUIDEsPipe extends ParseUUIDPipe {
  constructor() {
    super({
      exceptionFactory: () => {
        return new BadRequestException('El identificador proporcionado no es un formato UUID válido');
      },
    });
  }
}
