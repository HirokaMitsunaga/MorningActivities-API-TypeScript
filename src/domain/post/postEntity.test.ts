import { PostEntity } from "./postEntity.js";

describe("postEntityTest", () => {
  const expectedPost = new PostEntity(1, "test", 1);

  it("postエンティティの作成に成功する", async () => {
    expect(() => new PostEntity(1, "test", 1)).not.toThrow();
  });

  describe("validateId", () => {
    it("numberの場合、エラーを投げない", () => {
      expect(() => new PostEntity(1, "test", 1)).not.toThrow();
    });

    it("undefinedの場合、エラーを投げない", () => {
      expect(() => new PostEntity(undefined, "test", 1)).not.toThrow();
    });

    it("string型の場合、エラーを投げる", () => {
      expect(() => new PostEntity("1" as any, "test", 1)).toThrow(
        "postId is required and must be a number"
      );
    });

    it("null型の場合、エラーを投げる", () => {
      expect(() => new PostEntity(null as any, "test", 1)).toThrow(
        "postId is required and must be a number"
      );
    });
  });
});
