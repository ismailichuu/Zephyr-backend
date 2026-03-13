export class Skill {
  constructor(
    private _id: string,
    private _name: string,
    private _categories: string[],
    private _createdAt: Date | undefined,
  ) {}

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get categories() {
    return this._categories;
  }

  get createdAt() {
    return this._createdAt;
  }

  static create(params: {
    id: string;
    name: string;
    categories: string[];
    createdAt: Date | undefined;
  }) {
    return new Skill(
      params.id,
      params.name,
      params.categories,
      params.createdAt,
    );
  }
}
