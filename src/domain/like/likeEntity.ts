export class LikeEntity {
  constructor(
    private _id: number | undefined,
    private _userId: number,
    private _postId: number
  ) {}
  get id() {
    return this._id;
  }
  get userId() {
    return this._userId;
  }
  get postId() {
    return this._postId;
  }
}
