import { TaskRepository } from "./taskRepository.js";
import { TaskEntity } from "../../../domain/task/taskEntity.js";
import { Task } from "@prisma/client";

describe("TaskRepository Test", () => {
  //モックの型定義
  let mockTaskGateway: {
    createTask: jest.Mock<
      Promise<Task>,
      [
        title: string,
        userId: number,
        scheduleMinnutes: number | null,
        actualMinutes: number | null
      ]
    >;
    getAllTasks: jest.Mock<Promise<Task[] | undefined>, [userId: number]>;
    getTaskById: jest.Mock<
      Promise<Task | undefined>,
      [userId: number, taskId: number]
    >;
    updateTask: jest.Mock<
      Promise<Task>,
      [
        taskId: number,
        title: string,
        userId: number,
        scheduleMinnutes: number | null,
        actualMinutes: number | null
      ]
    >;
    deleteTask: jest.Mock<Promise<void>, [userId: number, taskId: number]>;
  };
  let taskRepository: TaskRepository;

  const task = new TaskEntity(undefined, "test", 1, 20, 20);
  const updateTask = new TaskEntity(1, "test", 1, 20, 20);

  const expectedDomainTask = new TaskEntity(1, "test", 1, 20, 20);

  const expectedPrismaTask = {
    id: 1,
    title: "test",
    userId: 1,
    scheduleMinnutes: 20,
    actualMinutes: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    //createTaskのモック化
    mockTaskGateway = {
      createTask: jest.fn(),
      getAllTasks: jest.fn(),
      getTaskById: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
    };
    taskRepository = new TaskRepository(mockTaskGateway);
  });
  describe("TaskRepository createTask", () => {
    it("タスク作成が成功する", async () => {
      mockTaskGateway.createTask.mockResolvedValue(expectedPrismaTask);
      const result = await taskRepository.createTask(task);
      expect(mockTaskGateway.createTask).toHaveBeenCalledWith(
        task.title,
        task.userId,
        task.scheduleMinnutes ?? null,
        task.actualMinutes ?? null
      );
      expect(result).toEqual(expectedDomainTask);
    });
    it("タスク作成が失敗", async () => {
      mockTaskGateway.createTask.mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(taskRepository.createTask(task)).rejects.toThrow(
        "Database error"
      );
    });
  });
  describe("TaskRepository getAllTasks", () => {
    it("タスクの取得に成功する", async () => {
      const expectedDomainTasks = [
        new TaskEntity(
          expectedDomainTask.id,
          expectedDomainTask.title,
          expectedDomainTask.userId,
          expectedDomainTask.scheduleMinnutes,
          expectedDomainTask.actualMinutes
        ),
      ];
      const expectedPrismaTasks = [expectedPrismaTask];
      mockTaskGateway.getAllTasks.mockResolvedValue(expectedPrismaTasks);
      const result = await taskRepository.getAllTasks(task.userId);
      expect(mockTaskGateway.getAllTasks).toHaveBeenCalledWith(task.userId);
      expect(result).toEqual(expectedDomainTasks);
    });
    it("タスクが存在しない", async () => {
      mockTaskGateway.getAllTasks.mockResolvedValue(undefined);
      const result = await taskRepository.getAllTasks(task.userId);
      expect(result).toEqual(undefined);
    });
    it("タスク作成が失敗", async () => {
      mockTaskGateway.getAllTasks.mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(taskRepository.getAllTasks(task.userId)).rejects.toThrow(
        "Database error"
      );
    });
  });
  describe("TaskRepository getTaskById", () => {
    const taskData = {
      userId: 1,
      taskId: 1,
    };
    it("タスクの取得に成功する", async () => {
      mockTaskGateway.getTaskById.mockResolvedValue(expectedPrismaTask);
      const result = await taskRepository.getTaskById(
        taskData.userId,
        taskData.taskId
      );
      expect(mockTaskGateway.getTaskById).toHaveBeenCalledWith(
        taskData.userId,
        taskData.taskId
      );
      expect(result).toEqual(expectedDomainTask);
    });
    it("タスクが存在しない", async () => {
      mockTaskGateway.getTaskById.mockResolvedValue(undefined);
      const result = await taskRepository.getTaskById(
        taskData.userId,
        taskData.taskId
      );
      expect(result).toEqual(undefined);
    });
    it("タスク作成が失敗", async () => {
      mockTaskGateway.getTaskById.mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(
        taskRepository.getTaskById(taskData.userId, taskData.taskId)
      ).rejects.toThrow("Database error");
    });
  });
  describe("TaskRepository updateTask", () => {
    it("タスク更新が成功する", async () => {
      mockTaskGateway.updateTask.mockResolvedValue(expectedPrismaTask);
      const result = await taskRepository.updateTask(updateTask);
      expect(mockTaskGateway.updateTask).toHaveBeenCalledWith(
        updateTask.id,
        updateTask.title,
        updateTask.userId,
        updateTask.scheduleMinnutes ?? null,
        updateTask.actualMinutes ?? null
      );
      expect(result).toEqual(expectedDomainTask);
    });
    it("taskIdがundefined型の場合、エラーを返す", async () => {
      const undefinedTaskId = new TaskEntity(undefined, "test", 1, 20, 20);
      await expect(taskRepository.updateTask(undefinedTaskId)).rejects.toThrow(
        "taskId is required and must be a number"
      );
    });
    it("タスク作成が失敗", async () => {
      mockTaskGateway.updateTask.mockRejectedValueOnce(
        new Error("Database error")
      );
      await expect(taskRepository.updateTask(updateTask)).rejects.toThrow(
        "Database error"
      );
    });
  });
});
