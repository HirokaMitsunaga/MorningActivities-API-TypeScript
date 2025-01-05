export class LikeEntity {
  constructor(
    private _id: number | undefined,
    private _sentence: string,
    private _userId: number
  ) {}
  get id() {
    return this._id;
  }
  get userId() {
    return this._sentence;
  }
  get postId() {
    return this._userId;
  }
}
