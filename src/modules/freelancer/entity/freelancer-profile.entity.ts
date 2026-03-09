import { ObjectId } from 'mongoose';
import { Availability } from '../domain/enums/freelancer-availability.enum';

export interface Experience {
  title: string;
  company: string;
  startDate: Date;
  endDate: Date;
}

export class FreelancerProfile {
  constructor(
    private _id: ObjectId | null,
    private _userId: string,
    private _imageUrl: string | null,
    private _jobCategory: string | null,
    private _jobSubCategory: string | null,
    private _bio: string | null,
    private _availability: Availability,
    private _location: string | null,
    private _experience: Experience[] | null,
    private _portfolioUrl: string | null,
    private _updatedAt: Date | null,
  ) {}

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get imageUrl() {
    return this._imageUrl;
  }

  get jobCategory() {
    return this._jobCategory;
  }

  get jobSubCategory() {
    return this._jobSubCategory;
  }

  get bio() {
    return this._bio;
  }

  get availability() {
    return this._availability;
  }

  get location() {
    return this._location;
  }

  get experience() {
    return this._experience;
  }

  get portfolioUrl() {
    return this._portfolioUrl;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  static create(params: {
    id: ObjectId | null;
    userId: string;
    imageUrl: string | null;
    jobCategory: string | null;
    jobSubCategory: string | null;
    bio: string | null;
    availability: Availability;
    location: string | null;
    experience: Experience[] | null;
    portfolioUrl: string | null;
    updatedAt: Date | null;
  }) {
    return new FreelancerProfile(
      params.id,
      params.userId,
      params.imageUrl,
      params.jobCategory,
      params.jobSubCategory,
      params.bio,
      params.availability,
      params.location,
      params.experience,
      params.portfolioUrl,
      params.updatedAt,
    );
  }
}
