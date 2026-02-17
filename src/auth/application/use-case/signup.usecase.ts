import { BadRequestException } from '@nestjs/common';
import type { PasswordService } from '../ports/password.service.port';
import type { OtpService } from '../ports/otp.service.port';
import type { EmailService } from '../ports/email.service.port';
import type { AuthUserRepository } from '../ports/auth-user-repository.port';
import type { IdGenerator } from '../ports/id-generator.port';
import { Role } from 'src/auth/presentation/dto/signup.dto';
import { User } from 'src/user/domain/entities/user.entity';
import { UserRole } from 'src/user/domain/enums/role.enum';
import { UserStatus } from 'src/user/domain/enums/userStatus.enum';
import { ALREADY_REGISTERED } from '../constants/error-message.const';

export class SignupUseCase {
  constructor(
    private readonly _authRepo: AuthUserRepository,
    private readonly _passwordService: PasswordService,
    private readonly _otpService: OtpService,
    private readonly _emailService: EmailService,
    private readonly _idGenerator: IdGenerator,
  ) {}

  async execute(name: string, email: string, password: string, role: Role) {
    const isAlready = await this._authRepo.findByEmail(email);
    if (isAlready && isAlready.isVerified)
      throw new BadRequestException(ALREADY_REGISTERED);
    const hashedPassword = await this._passwordService.hash(password);
    const userId = this._idGenerator.generateForRole(role);
    const userDetails = User.create({
      name,
      email,
      password: hashedPassword,
      role: role as unknown as UserRole,
      userId,
      isPremium: false,
      isVerified: false,
      subscriptionId: null,
      status: UserStatus.ACTIVE,
      provider: 'NORMAL',
    });
    let user: User | null;
    if (isAlready && !isAlready?.isVerified) {
      user = await this._authRepo.update(isAlready.userId, userDetails);
    } else {
      user = await this._authRepo.create(userDetails);
    }
    if (!user) throw new BadRequestException('Signup again');
    const { otp, sessionId } = await this._otpService.generate(
      user.userId,
      user.email,
      'signup',
    );
    await this._emailService.sendEmailSignup(user.email, otp);
    return sessionId;
  }
}
