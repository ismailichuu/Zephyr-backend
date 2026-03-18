export class FreelancerSkill {
  constructor(
    public _id: string,
    public _freelancerId: string,
    public _score: string | null,
    public _skillId: string,
    public _isValidated: boolean,
    public _lastValidatedAt: Date | null,
    public _expiredAt: Date | null,
    public _updatedAt: Date | null,
  ) {}

  get id(): string {
    return this._id;
  }

  get freelancerId(): string {
    return this._freelancerId;
  }

  get score(): string | null {
    return this._score;
  }

  get skillId(): string {
    return this._skillId;
  }

  get isValidated(): boolean {
    return this._isValidated;
  }

  get lastValidatedAt(): Date | null {
    return this._lastValidatedAt;
  }

  get expiredAt(): Date | null {
    return this._expiredAt;
  }

  get updatedAt(): Date | null {
    return this._updatedAt;
  }

  static create(
    id: string,
    freelancerId: string,
    score: string | null,
    skillId: string,
    isValidated: boolean,
    lastValidatedAt: Date | null,
    expiredAt: Date | null,
    updatedAt: Date | null,
  ): FreelancerSkill {
    return new FreelancerSkill(
      id,
      freelancerId,
      score,
      skillId,
      isValidated,
      lastValidatedAt,
      expiredAt,
      updatedAt,
    );
  }
}
