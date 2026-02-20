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
      isVerified: userDoc.isVerified,
      isPremium: userDoc.isPremium,
      subscriptionId: userDoc.subscriptionId,
      status: userDoc.status as UserStatus,
    });
  }

  private toPresistence(user: User): Partial<UserDocument> {
    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      isVerified: user.isVerified,
      provider: user.provider,
    };
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
      .findOneAndUpdate({ userId: id }, entity, { new: true })
      .exec();

    return updatedUser ? this.toDomain(updatedUser) : null;
  }

  async delete(id: string): Promise<void> {
    await this._userModel.findByIdAndDelete(id).exec();
  }
}
