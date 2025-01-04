import { TaskGateway } from "./taskGateway.js";
import { prismaMock } from "../../../singleton.js";

describe("TaskGateway", () => {
  let taskGateway: TaskGateway;

  const taskData = {
    title: "test",
    userId: 2,
    scheduleMinnutes: 20,
    actualMinutes: 23,
  };

  beforeEach(() => {
    taskGateway = new TaskGateway(prismaMock);
  });

  describe("TaskGateway createTask", () => {
    it("タスクの作成に成功する", async () => {
      const expectedTask = {
        id: 1,
        ...taskData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaMock.task.create.mockResolvedValue(expectedTask);
      const taskRecord = await taskGateway.createTask(
        taskData.title,
        taskData.userId,
        taskData.scheduleMinnutes,
        taskData.actualMinutes
      );
      expect(taskRecord).toEqual(expectedTask);
      expect(prismaMock.task.create).toHaveBeenCalledWith({ data: taskData });
    });

    it("タスク作成時にDBエラーで失敗する", async () => {
      prismaMock.task.create.mockRejectedValueOnce(new Error("Database error"));
      await expect(
        taskGateway.createTask(
          taskData.title,
          taskData.userId,
          taskData.scheduleMinnutes,
          taskData.actualMinutes
        )
      ).rejects.toThrow("Database error");
    });
  });
});
