import { Response } from 'express';
import { LOGOUT_SUCCESS } from '../constants/success-message.const';

export class LogoutUseCase {
  execute(res: Response) {
    res.clearCookie('refreshToken', {
      path: '/auth/refresh',
    });

    res.clearCookie('accessToken', {
      path: '/',
    });

    return {
      message: LOGOUT_SUCCESS,
    };
  }
}
