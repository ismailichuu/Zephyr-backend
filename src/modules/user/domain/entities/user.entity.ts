import { UserRole } from '../enums/role.enum';
import { UserStatus } from '../enums/userStatus.enum';

export class User {
  constructor(
    private _userId: string,
    private _name: string,
    private _email: string,
    private _password: string,
    private _role: UserRole,
    private _provider: string = 'normal',
    private _isOtpVerified: boolean = false,
    private _isPremium: boolean,
    private _subscriptionId: string | null,
    private _status: UserStatus = UserStatus.ACTIVE,
    private _joinedAt: Date | null,
    private _isAdminApproved: boolean,
  ) {}

  get isAdminApproved(): boolean {
    return this._isAdminApproved;
  }

  get userId(): string {
    return this._userId;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get role(): UserRole {
    return this._role;
  }

  get provider(): string {
    return this._provider;
  }

  get isOtpVerified(): boolean {
    return this._isOtpVerified;
  }

  get name(): string {
    return this._name;
  }

  get isPremium(): boolean {
    return this._isPremium;
  }

  get subscriptionId(): string | null {
    return this._subscriptionId;
  }

  get joinedAt(): Date | null {
    return this._joinedAt;
  }

  get status(): UserStatus {
    return this._status;
  }

  set isPremium(value: boolean) {
    this._isPremium = value;
  }

  set subscriptionId(value: string | null) {
    this._subscriptionId = value;
  }

  set status(value: UserStatus) {
    this._status = value;
  }

  static create(params: {
    name: string;
    userId: string;
    email: string;
    password: string;
    role: UserRole;
    provider: string;
    isOtpVerified: boolean;
    isPremium: boolean;
    subscriptionId: string | null;
    status: UserStatus;
    joinedAt: Date | null;
    isAdminApproved: boolean;
  }): User {
    return new User(
      params.userId,
      params.name,
      params.email,
      params.password,
      params.role,
      params.provider || 'normal',
      params.isOtpVerified || false,
      params.isPremium || false,
      params.subscriptionId || null,
      params.status || UserStatus.ACTIVE,
      params.joinedAt || null,
      params.isAdminApproved || false,
    );
  }
}
