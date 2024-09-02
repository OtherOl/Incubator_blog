import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class createNewPassword {
  @IsString()
  @Length(6, 20)
  newPassword: string;

  @IsString()
  recoveryCode: string;
}

export class resendConfirmation {
  @IsEmail()
  email: string;
}

export class ConfirmationCode {
  @IsString()
  code: string;
}

export class UserLogin {
  @IsString()
  loginOrEmail: string;

  @IsString()
  password: string;
}

export class createUserModel {
  @IsString()
  @Length(3, 10)
  @Matches('^[a-zA-Z0-9_-]*$')
  login: string;

  @Length(6, 20)
  password: string;

  @IsEmail()
  email: string;
}

export class userModel {
  id: string;
  login: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: any;
  };
  recoveryConfirmation: {
    recoveryCode: string;
    expirationDate: any;
  };
  isConfirmed: boolean;
}
