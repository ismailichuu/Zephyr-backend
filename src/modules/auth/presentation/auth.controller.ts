import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  ParseEnumPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoginUseCase } from '../application/use-case/login.usecase';
import { SignupUseCase } from '../application/use-case/signup.usecase';
import { Role, SignUpDto } from './dto/signup.dto';
import type { Request, Response } from 'express';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ResendOtpDto,
  VerifyOtpDto,
} from './dto/otp.dto';
import { OtpVerifyUsecase } from '../application/use-case/otp-verify.usecase';
import { ForgotPasswordUsecase } from '../application/use-case/forgot-password.usecase';
import { ChangePasswordUsecase } from '../application/use-case/change-password.usecase';
import { ResendOtpUsecase } from '../application/use-case/resend-otp.usecase';
import { GoogleLoginUseCase } from '../application/use-case/google-login.usecase';
import type { GoogleAuthPort } from '../application/ports/google-auth.port';
import { GOOGLE_AUTH_GATEWAY } from '../application/ports/auth.token';
import { RefreshTokenUseCase } from '../application/use-case/refresh-token.usecase';
import { UserRole } from 'src/modules/user/domain/enums/role.enum';
import { LogoutUseCase } from '../application/use-case/logout.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _loginUseCase: LoginUseCase,
    private readonly _signUpUseCase: SignupUseCase,
    private readonly _refreshUseCase: RefreshTokenUseCase,
    private readonly _otpVerfiyUsecase: OtpVerifyUsecase,
    private readonly _googleLoginUsecase: GoogleLoginUseCase,
    private readonly _forgotPasswordUsecase: ForgotPasswordUsecase,
    private readonly _changePasswordUsecase: ChangePasswordUsecase,
    private readonly _resendOtpUsecase: ResendOtpUsecase,
    private readonly _logoutUseCase: LogoutUseCase,
    @Inject(GOOGLE_AUTH_GATEWAY)
    private readonly _googleAuthService: GoogleAuthPort,
  ) {}

  //login with email and password
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this._loginUseCase.execute(dto.email, dto.password, res);
  }

  //signup with email and password
  @Post('signup')
  signup(@Body() dto: SignUpDto) {
    return this._signUpUseCase.execute(
      dto.name,
      dto.email,
      dto.password,
      dto.role,
    );
  }

  //logout user
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) res: Response) {
    return this._logoutUseCase.execute(res);
  }

  //refresh access token
  @Post('refresh')
  @HttpCode(HttpStatus.NO_CONTENT)
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this._refreshUseCase.execute(req, res);
  }

  //verify otp for signup and forgot password
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this._otpVerfiyUsecase.execute(
      dto.otp,
      dto.otpSessionId,
      dto.type,
      res,
    );
  }

  //resend otp for signup and forgot password
  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOtp(@Body() dto: ResendOtpDto) {
    return this._resendOtpUsecase.execute(dto.sessionId);
  }

  //google login
  @Get('google')
  googleRedirect(
    @Query('role', new ParseEnumPipe(Role)) role: Role,
    @Res() res: Response,
  ) {
    const url = this._googleAuthService.generateAuthUrl(role);
    return res.redirect(url);
  }

  //google auth callback
  @Get('google/callback')
  @HttpCode(HttpStatus.OK)
  googleAuth(
    @Query('code') code: string,
    @Query('state', new ParseEnumPipe(Role)) role: UserRole,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this._googleLoginUsecase.execute(code, role, res);
  }

  //forgot password
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this._forgotPasswordUsecase.execute(dto.email);
  }

  //password change after forgot password otp verification
  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  changePassword(
    @Body() dto: ChangePasswordDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this._changePasswordUsecase.execute(req, res, dto.password);
  }
}
