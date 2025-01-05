export class PostEntity {
  constructor(
    private _id: number | undefined,
    private _sentence: string,
    private _userId: number
  ) {}
  get id() {
    return this._id;
  }
  get sentence() {
    return this._sentence;
  }
  get userId() {
    return this._userId;
  }
}
