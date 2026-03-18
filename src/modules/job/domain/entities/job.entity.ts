import { HiringMode } from '../enums/hiring-mode.enum';
import { JobStatus } from '../enums/job-status.enum';
import { Attachment } from '../types/attachment.type';
import { BudgetRange } from '../types/budget-range.type';

export class Job {
  constructor(
    public _id: string,
    public _clientId: string,
    public _title: string,
    public _description: string,
    public _category: string,
    public _budgetRange: BudgetRange,
    public _duration: string,
    public _requiredSkills: string[],
    public _attachments: Attachment[] | null,
    public _hiringMode: HiringMode,
    public _status: JobStatus,
    public _createdAt: Date | null,
    public _updatedAt: Date | null,
  ) {}

  get id(): string {
    return this._id;
  }

  get clientId(): string {
    return this._clientId;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get category(): string {
    return this._category;
  }

  get budgetRange(): BudgetRange {
    return this._budgetRange;
  }

  get duration(): string {
    return this._duration;
  }

  get requiredSkills(): string[] {
    return this._requiredSkills;
  }

  get attachments(): Attachment[] | null {
    return this._attachments;
  }

  get hiringMode(): HiringMode {
    return this._hiringMode;
  }

  get status(): JobStatus {
    return this._status;
  }

  get createdAt(): Date | null {
    return this._createdAt;
  }

  get updatedAt(): Date | null {
    return this._updatedAt;
  }

  static create(
    id: string,
    userId: string,
    title: string,
    description: string,
    category: string,
    budgetRange: BudgetRange,
    duration: string,
    requiredSkills: string[],
    attachments: Attachment[] | null,
    hiringMode: HiringMode,
    status: JobStatus,
    createdAt: Date | null,
    updatedAt: Date | null,
  ): Job {
    return new Job(
      id,
      userId,
      title,
      description,
      category,
      budgetRange,
      duration,
      requiredSkills,
      attachments,
      hiringMode,
      status,
      createdAt,
      updatedAt,
    );
  }
}
