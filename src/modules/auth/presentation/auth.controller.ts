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
  UnauthorizedException,
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
import { TOKEN_EXPIRED } from '../application/constants/error-message.const';
import { RefreshTokenUseCase } from '../application/use-case/refresh-token.usecase';
import { UserRole } from 'src/modules/user/domain/enums/role.enum';

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
    @Inject(GOOGLE_AUTH_GATEWAY)
    private readonly _googleAuthService: GoogleAuthPort,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this._loginUseCase.execute(dto.email, dto.password);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    return {
      message: 'Login Successful',
      user,
    };
  }

  @Post('signup')
  async signup(@Body() dto: SignUpDto) {
    const sessionId = await this._signUpUseCase.execute(
      dto.name,
      dto.email,
      dto.password,
      dto.role,
    );

    return {
      message: 'User creation successfull',
      readyToVeify: true,
      emailSent: true,
      otpSessionId: sessionId,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', {
      path: '/auth/refresh',
    });

    res.clearCookie('accessToken', {
      path: '/',
    });

    return {
      message: 'Logged out Successfully',
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.NO_CONTENT)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const oldRefreshToken = req?.cookies?.refreshToken as string | undefined;

    if (!oldRefreshToken)
      throw new UnauthorizedException('token expired or missing');

    const { accessToken, refreshToken } =
      await this._refreshUseCase.execute(oldRefreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });
    return {
      message: 'token refreshed',
    };
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this._otpVerfiyUsecase.execute(
      dto.otp,
      dto.otpSessionId,
      dto.type,
    );

    if (result.type === 'FORGOT_SUCCESS') {
      res.cookie('resetToken', result.resetToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/auth/change-password',
        maxAge: 10 * 60 * 10000,
      });
      return {
        message: 'otp verified successfully',
        readyToChange: true,
      };
    }

    const { user, refreshToken, accessToken } = result;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    return {
      message: 'verification successful',
      user,
    };
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOtp(@Body() dto: ResendOtpDto) {
    const result = await this._resendOtpUsecase.execute(dto.sessionId);

    return {
      message: 'Otp Resend Successful',
      ...result,
    };
  }

  @Get('google')
  googleRedirect(
    @Query('role', new ParseEnumPipe(Role)) role: Role,
    @Res() res: Response,
  ) {
    const url = this._googleAuthService.generateAuthUrl(role);
    return res.redirect(url);
  }

  @Get('google/callback')
  @HttpCode(HttpStatus.OK)
  async googleAuth(
    @Query('code') code: string,
    @Query('state', new ParseEnumPipe(Role)) role: UserRole,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this._googleLoginUsecase.execute(code, role, res);

    if (!result) return result;

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    return res.redirect(
      `${process.env.CLIENT_URL + result.user?.role.toLowerCase()}`,
    );
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const { sessionId } = await this._forgotPasswordUsecase.execute(dto.email);

    return {
      otpSessionId: sessionId,
    };
  }

  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies.resetToken as string | undefined;
    if (!token) throw new UnauthorizedException(TOKEN_EXPIRED);
    const result = await this._changePasswordUsecase.execute(
      dto.password,
      token,
    );

    res.clearCookie('resetToken', {
      path: '/auth/change-password',
    });

    return {
      message: 'password change successful',
      ...result,
    };
  }
}
