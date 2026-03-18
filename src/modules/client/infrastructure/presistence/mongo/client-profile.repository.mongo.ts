import { InjectModel } from '@nestjs/mongoose';
import { ClientProfile } from 'src/modules/client/domain/entities/client-profile.entity';
import { ClientProfileRepository } from 'src/modules/client/domain/repositories/client-profile.repository';
import { ClientProfileDocument } from './client-profile.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ClientPresistenceMappers } from './client-presistence.mappers';

@Injectable()
export class ClientProfileRepositoryMongo implements ClientProfileRepository {
  constructor(
    @InjectModel(ClientProfileDocument.name)
    private readonly _clientProfileModel: Model<ClientProfileDocument>,
  ) {}

  async findById(id: string): Promise<ClientProfile | null> {
    const clientProfile = await this._clientProfileModel
      .findOne({ userId: id })
      .exec();

    return clientProfile
      ? ClientPresistenceMappers.toDomain(clientProfile)
      : null;
  }

  async findAll(): Promise<ClientProfile[]> {
    const profiles = await this._clientProfileModel.find().exec();

    return profiles.map((profile) =>
      ClientPresistenceMappers.toDomain(profile),
    );
  }

  async create(entity: ClientProfile): Promise<ClientProfile> {
    const createdProfile = new this._clientProfileModel(
      ClientPresistenceMappers.toPersistence(entity),
    );

    const savedProfile = await createdProfile.save();

    return ClientPresistenceMappers.toDomain(savedProfile);
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

    return updatedProfile
      ? ClientPresistenceMappers.toDomain(updatedProfile)
      : null;
  }

  countDocument(): Promise<number> {
    return this._clientProfileModel.countDocuments();
  }
}
