import { FreelancerProfile } from 'src/modules/freelancer/domain/entity/freelancer-profile.entity';
import { FreelancerProfileRepository } from 'src/modules/freelancer/domain/repositories/freelancer-profile.repository';
import { FreelancerProfileDocument } from './freelancer-profile.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Availability } from 'src/modules/freelancer/domain/enums/freelancer-availability.enum';

export class FreelancerProfileRepositoryMongo implements FreelancerProfileRepository {
  constructor(
    @InjectModel(FreelancerProfileDocument.name)
    private readonly _freelancerProfileModel: Model<FreelancerProfileDocument>,
  ) {}

  private _toDomain(FreelancerProfileDoc: FreelancerProfileDocument) {
    return FreelancerProfile.create({
      id: FreelancerProfileDoc._id.toString(),
      userId: FreelancerProfileDoc.userId,
      imageUrl: FreelancerProfileDoc.imageUrl,
      jobCategory: FreelancerProfileDoc.jobCategory,
      jobSubCategory: FreelancerProfileDoc.jobSubCategory,
      bio: FreelancerProfileDoc.bio,
      availability: FreelancerProfileDoc.availability as Availability,
      location: FreelancerProfileDoc.location,
      experience: FreelancerProfileDoc.experience,
      portfolioUrl: FreelancerProfileDoc.portofolioUrl,
      updatedAt: FreelancerProfileDoc.updatedAt ?? null,
    });
  }

  private _toPersistence(
    freelancerProfile: FreelancerProfile,
  ): Partial<FreelancerProfileDocument> {
    return {
      userId: freelancerProfile.userId,
      imageUrl: freelancerProfile.imageUrl,
      jobCategory: freelancerProfile.jobCategory ?? undefined,
      jobSubCategory: freelancerProfile.jobSubCategory ?? undefined,
      bio: freelancerProfile.bio,
      availability: freelancerProfile.availability,
      location: freelancerProfile.location,
      experience: freelancerProfile.experience ?? [],
      portofolioUrl: freelancerProfile.portfolioUrl,
    };
  }

  async findById(id: string): Promise<FreelancerProfile | null> {
    const freelancerProfile = await this._freelancerProfileModel
      .findOne({ userId: id })
      .exec();

    return freelancerProfile ? this._toDomain(freelancerProfile) : null;
  }

  async findAll(): Promise<FreelancerProfile[]> {
    const freelancerProfiles = await this._freelancerProfileModel.find().exec();

    return freelancerProfiles.map((profile) => this._toDomain(profile));
  }

  async create(entity: FreelancerProfile): Promise<FreelancerProfile> {
    const createdProfile = new this._freelancerProfileModel(
      this._toPersistence(entity),
    );
    const savedProfile = await createdProfile.save();

    return this._toDomain(savedProfile);
  }

  async update(
    id: string,
    entity: Partial<FreelancerProfile>,
  ): Promise<FreelancerProfile | null> {
    const updatedProfile = await this._freelancerProfileModel
      .findOneAndUpdate({ userId: id }, entity, { new: true })
      .exec();

    return updatedProfile ? this._toDomain(updatedProfile) : null;
  }

  async countDocument(): Promise<number> {
    return this._freelancerProfileModel.countDocuments();
  }
}
