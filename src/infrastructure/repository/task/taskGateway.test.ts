import { TaskGateway } from "./taskGateway.js";
import { prismaMock } from "../../../singleton.js";

describe("TaskGateway", () => {
  let taskGateway: TaskGateway;

  const taskData = {
    title: "test",
    userId: 2,
    scheduleMinutes: 20,
    actualMinutes: 23,
  };

  const updataTaskData = {
    id: 1,
    title: "test",
    userId: 2,
    scheduleMinutes: 20,
    actualMinutes: 23,
  };

  beforeAll(() => {
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
        taskData.scheduleMinutes,
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
          taskData.scheduleMinutes,
          taskData.actualMinutes
        )
      ).rejects.toThrow("Database error");
    });
  });
  describe("TaskGateway getAllTasks", () => {
    it("タスクの取得に成功する", async () => {
      const expectedTask = [
        {
          id: 1,
          ...taskData,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      prismaMock.task.findMany.mockResolvedValue(expectedTask);
      const taskRecord = await taskGateway.getAllTasks(taskData.userId);
      expect(taskRecord).toEqual(expectedTask);
    });
    it("タスクが存在しない", async () => {
      prismaMock.task.findMany.mockResolvedValue([]);
      expect(await taskGateway.getAllTasks(taskData.userId)).toEqual([]);
    });

    it("タスク作成時にDBエラーで失敗する", async () => {
      prismaMock.task.findMany.mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(taskGateway.getAllTasks(taskData.userId)).rejects.toThrow(
        "Database error"
      );
    });
  });
  describe("TaskGateway getTaskById", () => {
    const taskData = {
      taskId: 1,
      userId: 2,
    };
    it("タスクの取得に成功する", async () => {
      const expectedTask = {
        id: 1,
        title: "test",
        userId: 2,
        scheduleMinutes: 20,
        actualMinutes: 23,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaMock.task.findFirst.mockResolvedValue(expectedTask);
      const taskRecord = await taskGateway.getTaskById(
        taskData.userId,
        taskData.taskId
      );
      expect(taskRecord).toEqual(expectedTask);
    });
    it("タスクが存在しない", async () => {
      prismaMock.task.findFirst.mockResolvedValue(null);
      expect(
        await taskGateway.getTaskById(taskData.userId, taskData.taskId)
      ).toEqual(undefined);
    });

    it("タスク作成時にDBエラーで失敗する", async () => {
      prismaMock.task.findFirst.mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(
        taskGateway.getTaskById(taskData.userId, taskData.taskId)
      ).rejects.toThrow("Database error");
    });
  });
  describe("TaskGateway updateTask", () => {
    it("タスクの更新に成功する", async () => {
      const expectedTask = {
        id: 1,
        ...taskData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaMock.task.update.mockResolvedValue(expectedTask);
      const taskRecord = await taskGateway.updateTask(
        updataTaskData.id,
        updataTaskData.title,
        updataTaskData.userId,
        updataTaskData.scheduleMinutes,
        updataTaskData.actualMinutes
      );
      expect(taskRecord).toEqual(expectedTask);
      expect(prismaMock.task.update).toHaveBeenCalledWith({
        where: {
          id: updataTaskData.id,
          userId: updataTaskData.userId,
        },
        data: {
          title: updataTaskData.title,
          scheduleMinutes: updataTaskData.scheduleMinutes,
          actualMinutes: updataTaskData.actualMinutes,
        },
      });
    });

    it("タスク作成時にDBエラーで失敗する", async () => {
      prismaMock.task.update.mockRejectedValueOnce(new Error("Database error"));
      await expect(
        taskGateway.updateTask(
          updataTaskData.id,
          updataTaskData.title,
          updataTaskData.userId,
          updataTaskData.scheduleMinutes,
          updataTaskData.actualMinutes
        )
      ).rejects.toThrow("Database error");
    });
  });
  describe("TaskGateway deleteTask", () => {
    const taskData = {
      taskId: 1,
      userId: 2,
    };
    it("タスクの削除に成功する", async () => {
      const expectedTask = {
        id: 1,
        title: "test",
        userId: 2,
        scheduleMinutes: 20,
        actualMinutes: 23,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaMock.task.delete.mockResolvedValue(expectedTask);
      const taskRecord = await taskGateway.deleteTask(
        taskData.userId,
        taskData.taskId
      );
      expect(taskRecord).toBe(undefined);
    });

    it("タスク削除時にDBエラーで失敗する", async () => {
      prismaMock.task.delete.mockRejectedValueOnce(new Error("Database error"));
      await expect(
        taskGateway.deleteTask(taskData.userId, taskData.taskId)
      ).rejects.toThrow("Database error");
    });
  });
});
