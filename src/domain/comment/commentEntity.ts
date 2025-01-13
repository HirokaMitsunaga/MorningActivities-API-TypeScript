export class CommentEntity {
  constructor(
    private _id: number | undefined,
    private _comment: string,
    private _userId: number,
    private _postId: number
  ) {}
  get id() {
    return this._id;
  }
  get comment() {
    return this._comment;
  }
  get userId() {
    return this._userId;
  }
  get postId() {
    return this._postId;
  }
}
