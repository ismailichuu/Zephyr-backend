import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { UserRepository } from 'src/modules/user/domain/repositories/user.repository';
import { User } from 'src/modules/user/domain/entities/user.entity';
import { UserRole } from 'src/modules/user/domain/enums/role.enum';
import { UserStatus } from 'src/modules/user/domain/enums/userStatus.enum';

export class UserRepositoryMongo implements UserRepository {
  constructor(
    @InjectModel(UserDocument?.name)
    private readonly _userModel: Model<UserDocument>,
  ) {}
  private toDomain(userDoc: UserDocument): User {
    return User.create({
      userId: userDoc.userId,
      name: userDoc.name,
      email: userDoc.email,
      password: userDoc.password,
      role: userDoc.role as UserRole,
      provider: userDoc.provider,
      isOtpVerified: userDoc.isOtpVerified,
      isPremium: userDoc.isPremium,
      subscriptionId: userDoc.subscriptionId,
      status: userDoc.status as UserStatus,
      joinedAt: userDoc.createdAt || null,
      isAdminApproved: userDoc.isAdminApproved,
    });
  }

  private toPresistence(user: User): Partial<UserDocument> {
    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      isOtpVerified: user.isOtpVerified,
      provider: user.provider,
      isAdminApproved: user.isAdminApproved,
    };
  }

  countDocument(): Promise<number> {
    return this._userModel.countDocuments({ role: { $ne: UserRole.ADMIN } });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this._userModel.findOne({ email }).exec();
    return user ? this.toDomain(user) : null;
  }

  async create(entity: User): Promise<User> {
    const createdUser = new this._userModel(this.toPresistence(entity));
    const savedUser = await createdUser.save();
    return this.toDomain(savedUser);
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await this._userModel.findOne({ userId: id }).exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  async findAll(): Promise<User[]> {
    const userDocs = await this._userModel.find().exec();
    return userDocs.map((doc) => this.toDomain(doc));
  }

  async update(id: string, entity: Partial<User>): Promise<User | null> {
    const updatedUser = await this._userModel
      .findOneAndUpdate({ userId: id }, entity, { returnDocument: 'after' })
      .exec();

    return updatedUser ? this.toDomain(updatedUser) : null;
  }

  async findPaginated(
    page: number,
    limit: number,
    search: string,
  ): Promise<{
    data: User[];
    total: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {
      role: { $ne: UserRole.ADMIN },
    };

    if (search?.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const [docs, total] = await Promise.all([
      this._userModel.find(filter).skip(skip).limit(limit).exec(),
      this._userModel.countDocuments(filter),
    ]);

    return {
      data: docs.map((doc) => this.toDomain(doc)),
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
