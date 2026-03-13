import { InjectModel } from '@nestjs/mongoose';
import { ClientProfile } from 'src/modules/client/domain/entities/client-profile.entity';
import { ClientProfileRepository } from 'src/modules/client/domain/repositories/client-profile.repository';
import { ClientProfileDocument } from './client-profile.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientProfileRepositoryMongo implements ClientProfileRepository {
  constructor(
    @InjectModel(ClientProfileDocument.name)
    private readonly _clientProfileModel: Model<ClientProfileDocument>,
  ) {}

  private _toDomain(clientProfileDoc: ClientProfileDocument) {
    return ClientProfile.create({
      id: clientProfileDoc._id.toString() ?? null,
      userId: clientProfileDoc.userId,
      imageUrl: clientProfileDoc.imageUrl,
      bio: clientProfileDoc.bio,
      companyName: clientProfileDoc.companyName,
      location: clientProfileDoc.location,
      updatedAt: clientProfileDoc.updatedAt ?? null,
    });
  }

  private _toPersistence(
    clientProfile: ClientProfile,
  ): Partial<ClientProfileDocument> {
    return {
      userId: clientProfile.userId,
      imageUrl: clientProfile.imageUrl,
      bio: clientProfile.bio,
      location: clientProfile.location,
      companyName: clientProfile.companyName,
    };
  }

  async findById(id: string): Promise<ClientProfile | null> {
    const clientProfile = await this._clientProfileModel
      .findOne({ userId: id })
      .exec();

    return clientProfile ? this._toDomain(clientProfile) : null;
  }

  async findAll(): Promise<ClientProfile[]> {
    const profiles = await this._clientProfileModel.find().exec();

    return profiles.map((profile) => this._toDomain(profile));
  }

  async create(entity: ClientProfile): Promise<ClientProfile> {
    const createdProfile = new this._clientProfileModel(
      this._toPersistence(entity),
    );

    const savedProfile = await createdProfile.save();

    return this._toDomain(savedProfile);
  }

  async update(
    id: string,
    entity: Partial<ClientProfile>,
  ): Promise<ClientProfile | null> {
    const updatedProfile = await this._clientProfileModel.findOneAndUpdate(
      { userId: id },
      entity,
      { returnDocument: 'after' },
    );

    return updatedProfile ? this._toDomain(updatedProfile) : null;
  }

  countDocument(): Promise<number> {
    return this._clientProfileModel.countDocuments();
  }
}
