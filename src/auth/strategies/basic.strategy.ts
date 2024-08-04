import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  public validate = async (username: string, password: string): Promise<boolean> => {
    if ('admin' === username && 'qwerty' === password) {
      return true;
    }

    throw new UnauthorizedException();
  };
}
