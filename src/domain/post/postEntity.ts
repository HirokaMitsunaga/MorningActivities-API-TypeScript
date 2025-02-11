export class PostEntity {
  constructor(
    private _id: number | undefined,
    private _sentence: string,
    private _userId: number
  ) {
    this.validateId();
  }
  get id() {
    return this._id;
  }
  get sentence() {
    return this._sentence;
  }
  get userId() {
    return this._userId;
  }

  private validateId(): void {
    if (this._id !== undefined && typeof this._id !== "number") {
      throw new Error("postId is required and must be a number");
    }
  }
}
