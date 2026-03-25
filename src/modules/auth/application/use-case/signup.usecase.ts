import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { PasswordService } from '../ports/password.service.port';
import type { OtpService } from '../ports/otp.service.port';
import type { EmailService } from '../ports/email.service.port';
import type { AuthUserRepository } from '../ports/auth-user-repository.port';
import type { IdGenerator } from '../ports/id-generator.port';
import {
  ALREADY_REGISTERED,
  SIGNUP_AGAIN,
} from '../constants/error-message.const';
import {
  AUTH_USER_REPOSITORY,
  EMAIL_SERVICE,
  ID_GENERATOR,
  OTP_SERVICE,
  PASSWORD_SERVICE,
} from '../ports/auth.token';
import { User } from 'src/modules/user/domain/entities/user.entity';
import { UserRole } from 'src/modules/user/domain/enums/role.enum';
import { UserStatus } from 'src/modules/user/domain/enums/userStatus.enum';
import { Role } from '../../presentation/dto/signup.dto';
import { SignupInput } from '../types/signup.input';
import { ISignupUsecase } from './signup.usecase.interface';
import { SignupOutput } from '../types/signup.output';

@Injectable()
export class SignupUseCase implements ISignupUsecase {
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly _authRepo: AuthUserRepository,
    @Inject(PASSWORD_SERVICE)
    private readonly _passwordService: PasswordService,
    @Inject(OTP_SERVICE)
    private readonly _otpService: OtpService,
    @Inject(EMAIL_SERVICE)
    private readonly _emailService: EmailService,
    @Inject(ID_GENERATOR)
    private readonly _idGenerator: IdGenerator,
  ) {}

  async execute(dto: SignupInput): Promise<SignupOutput> {
    const isAlready = await this._authRepo.findByEmail(dto.email);
    if (isAlready && isAlready.isOtpVerified)
      throw new BadRequestException(ALREADY_REGISTERED);
    const hashedPassword = await this._passwordService.hash(dto.password);
    const userId = this._idGenerator.generateForRole(dto.role);
    const userDetails = User.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role as unknown as UserRole,
      userId,
      isPremium: false,
      isOtpVerified: false,
      subscriptionId: null,
      status: UserStatus.ACTIVE,
      provider: 'NORMAL',
      joinedAt: null,
      isAdminApproved: dto.role === Role.FREELANCER ? true : false,
    });
    let user: User | null;
    if (isAlready && !isAlready?.isOtpVerified) {
      user = await this._authRepo.update(isAlready.userId, userDetails);
    } else {
      user = await this._authRepo.create(userDetails);
    }
    if (!user) throw new BadRequestException(SIGNUP_AGAIN);
    const { otp, sessionId } = await this._otpService.generate(
      user.userId,
      user.email,
      'signup',
    );
    await this._emailService.sendEmailSignup(user.email, otp);

    return {
      otpSessionId: sessionId,
    };
  }
}
