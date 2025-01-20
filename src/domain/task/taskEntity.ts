export class TaskEntity {
  constructor(
    private _id: number | undefined,
    private _title: string,
    private _userId: number,
    private _scheduleMinutes: number | null | undefined,
    private _actualMinutes: number | null | undefined,
    private _createdAt?: Date,
    private _updatedAt?: Date
  ) {}
  get id() {
    return this._id;
  }
  get title() {
    return this._title;
  }
  get userId() {
    return this._userId;
  }
  get scheduleMinutes() {
    return this._scheduleMinutes;
  }
  get actualMinutes() {
    return this._actualMinutes;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }
}
