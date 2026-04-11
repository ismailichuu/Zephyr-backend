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
import { LoginRequestDto, LoginResponseDto } from './dto/login.dtos';
import { Role, SignUpRequestDto, SignUpResponseDto } from './dto/signup.dto';
import type { Request, Response } from 'express';
import {
  ChangePasswordRequestDto,
  ChangePasswordResponseDto,
  ForgotPasswordRequestDto,
  ForgotPasswordResponseDto,
  ResendOtpRequestDto,
  ResendOtpResponseDto,
  VerifyOtpRequestDto,
  VerifyOtpResponseDto,
} from './dto/otp.dto';
import type { GoogleAuthPort } from '../application/ports/google-auth.port';
import { GOOGLE_AUTH_GATEWAY } from '../application/ports/auth.token';
import {
  FORGOT_PASSWORD_SUCCESS,
  LOGIN_SUCCESS,
  OTP_RESEND_SUCCESS,
  OTP_VERIFICATION_SUCCESS,
  USER_,
} from '../application/constants/success-message.const';
import { CookieServiceUtil } from './utils/cookie.util';
import {
  ADMIN_LOGIN_USECASE,
  CHANGE_PASSWORD_USECASE,
  FORGOT_OTP_VERIFY_USECASE,
  FORGOT_PASSWORD_USECASE,
  GOOGLE_LOGIN_USECASE,
  LOGIN_USECASE,
  REFRESH_TOKEN_USECASE,
  RESEND_OTP_USECASE,
  SIGNUP_OTP_VERIFY_USECASE,
  SIGNUP_USECASE,
} from '../application/use-case/tokens.usecase';
import type { ILoginUsecase } from '../application/use-case/interfaces/login.usecase.interface';
import type { ISignupUsecase } from '../application/use-case/interfaces/signup.usecase.interface';
import type { IRefreshTokenUsecase } from '../application/use-case/interfaces/refresh-token.usecase.interface';
import type { IForgotOtpVerifyUsecase } from '../application/use-case/interfaces/forgot-otp-verify.usecase.interface';
import type { ISignupOtpVerifyUsecase } from '../application/use-case/interfaces/signup-otp-verify.usecase.interface';
import type { IGoogleLoginUsecase } from '../application/use-case/interfaces/google-login.usecase.interface';
import type { IForgotPasswordUsecase } from '../application/use-case/interfaces/forgot-password.usecase.interface';
import type { IChangePasswordUsecase } from '../application/use-case/interfaces/change-password.uscase.interface';
import type { IResendOtpUsecase } from '../application/use-case/interfaces/resend-otp.usecase.interface';
import type { IAdminLoginUseCase } from '../application/use-case/interfaces/admin-login.usecase.interface';
import { ResponseMessage } from '../../../common/decarators/success-message.decarator';
import { UserRole } from '../../user/domain/enums/role.enum';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(LOGIN_USECASE)
    private readonly _loginUseCase: ILoginUsecase,
    @Inject(SIGNUP_USECASE)
    private readonly _signUpUseCase: ISignupUsecase,
    @Inject(REFRESH_TOKEN_USECASE)
    private readonly _refreshUseCase: IRefreshTokenUsecase,
    @Inject(FORGOT_OTP_VERIFY_USECASE)
    private readonly _forgotOtpVerfiyUsecase: IForgotOtpVerifyUsecase,
    @Inject(SIGNUP_OTP_VERIFY_USECASE)
    private readonly _signupOtpVerifyUsecase: ISignupOtpVerifyUsecase,
    @Inject(GOOGLE_LOGIN_USECASE)
    private readonly _googleLoginUsecase: IGoogleLoginUsecase,
    @Inject(FORGOT_PASSWORD_USECASE)
    private readonly _forgotPasswordUsecase: IForgotPasswordUsecase,
    @Inject(CHANGE_PASSWORD_USECASE)
    private readonly _changePasswordUsecase: IChangePasswordUsecase,
    @Inject(RESEND_OTP_USECASE)
    private readonly _resendOtpUsecase: IResendOtpUsecase,
    @Inject(ADMIN_LOGIN_USECASE)
    private readonly _adminLoginUsecase: IAdminLoginUseCase,
    @Inject(GOOGLE_AUTH_GATEWAY)
    private readonly _googleAuthService: GoogleAuthPort,
  ) {}

  //login with email and password
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(LOGIN_SUCCESS)
  async login(
    @Body() dto: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const { accessToken, refreshToken, user } =
      await this._loginUseCase.execute(dto);
    CookieServiceUtil.setAuthCookie(res, accessToken, refreshToken);
    return {
      user,
    };
  }

  //login with email and password admin
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  async adminLogin(
    @Body() dto: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const { user, accessToken, refreshToken } =
      await this._adminLoginUsecase.execute(dto);
    CookieServiceUtil.setAuthCookie(res, accessToken, refreshToken);
    return {
      user,
    };
  }

  //signup with email and password
  @ResponseMessage(USER_)
  @Post('signup')
  async signup(@Body() dto: SignUpRequestDto): Promise<SignUpResponseDto> {
    const { otpSessionId } = await this._signUpUseCase.execute(dto);
    return {
      otpSessionId,
      readyToVerify: true,
    };
  }

  //logout user
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) res: Response): void {
    res.clearCookie('refreshToken', {
      path: '/',
    });

    res.clearCookie('accessToken', {
      path: '/',
    });
  }

  //refresh access token
  @Post('refresh')
  @HttpCode(HttpStatus.NO_CONTENT)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const oldRefreshToken = req?.cookies?.refreshToken as string | undefined;
    const { refreshToken, accessToken } = await this._refreshUseCase.execute({
      oldRefreshToken,
    });
    CookieServiceUtil.setAuthCookie(res, accessToken, refreshToken);
  }

  //verify otp for signup and forgot password
  @Post('verify-otp')
  @ResponseMessage(OTP_VERIFICATION_SUCCESS)
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body() dto: VerifyOtpRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<VerifyOtpResponseDto> {
    if (dto.type === 'signup') {
      const { accessToken, refreshToken, user } =
        await this._signupOtpVerifyUsecase.execute({
          otp: dto.otp,
          sessionId: dto.otpSessionId,
        });
      CookieServiceUtil.setAuthCookie(res, accessToken, refreshToken);

      return {
        user,
      };
    }
    const { resetToken } = await this._forgotOtpVerfiyUsecase.execute({
      sessionId: dto.otpSessionId,
      otp: dto.otp,
    });

    res.cookie('resetToken', resetToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/auth/change-password',
      maxAge: 10 * 60 * 10000,
    });

    return {
      readyToVerify: true,
    };
  }

  //resend otp for signup and forgot password
  @Post('resend-otp')
  @ResponseMessage(OTP_RESEND_SUCCESS)
  @HttpCode(HttpStatus.OK)
  async resendOtp(
    @Body() dto: ResendOtpRequestDto,
  ): Promise<ResendOtpResponseDto> {
    await this._resendOtpUsecase.execute(dto);

    return {
      emailSent: true,
    };
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async googleAuth(
    @Query('code') code: string,
    @Query('state', new ParseEnumPipe(Role)) role: UserRole,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const result = await this._googleLoginUsecase.execute({ code, role });
    if (result.isError) {
      return res.redirect(result.url);
    }

    CookieServiceUtil.setAuthCookie(
      res,
      result.accessToken!,
      result.refreshToken!,
    );

    return res.redirect(result.url);
  }

  //forgot password
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(FORGOT_PASSWORD_SUCCESS)
  forgotPassword(
    @Body() dto: ForgotPasswordRequestDto,
  ): Promise<ForgotPasswordResponseDto> {
    return this._forgotPasswordUsecase.execute(dto);
  }

  //password change after forgot password otp verification
  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Body() dto: ChangePasswordRequestDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ChangePasswordResponseDto> {
    const token = req.cookies.resetToken as string | undefined;
    await this._changePasswordUsecase.execute({
      token: token,
      password: dto.password,
    });

    res.clearCookie('resetToken', {
      path: '/auth/change-password',
    });

    return {
      readToLogin: true,
    };
  }
}
