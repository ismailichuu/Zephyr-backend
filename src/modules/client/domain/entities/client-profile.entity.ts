export class ClientProfile {
  constructor(
    private readonly _id: string | null,
    private readonly _userId: string,
    private readonly _imageUrl: string | null,
    private readonly _bio: string | null,
    private readonly _companyName: string | null,
    private readonly _location: string | null,
    private readonly _updatedAt: Date | null,
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

  get companyName() {
    return this._companyName;
  }

  get bio() {
    return this._bio;
  }

  get location() {
    return this._location;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  static create(params: {
    id: string | null;
    userId: string;
    imageUrl: string | null;
    bio: string | null;
    location: string | null;
    companyName: string | null;
    updatedAt: Date | null;
  }) {
    return new ClientProfile(
      params.id,
      params.userId,
      params.imageUrl,
      params.bio,
      params.companyName,
      params.location,
      params.updatedAt,
    );
  }
}
