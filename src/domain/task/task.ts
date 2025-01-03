export class Task {
  constructor(
    private _id: number | undefined,
    private _title: string,
    private _userId: number,
    private _scheduleMinnutes: number | undefined,
    private _actualMinutes: number | undefined // Todo 下記2つはフロントで受け取ってるがOmitしており、使ってないので後々消す // private _createdAt: Date, // private _updatedAt: Date
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
  get scheduleMinnutes() {
    return this._scheduleMinnutes;
  }
  get actualMinutes() {
    return this._actualMinutes;
  }
}
