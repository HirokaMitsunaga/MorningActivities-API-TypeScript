export class CommentLikeEntity {
  constructor(
    private _id: number | undefined,
    private _userId: number,
    private _commentId: number
  ) {}
  get id() {
    return this._id;
  }
  get userId() {
    return this._userId;
  }
  get commentId() {
    return this._commentId;
  }
}
