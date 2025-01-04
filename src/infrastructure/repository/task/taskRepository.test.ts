import { TaskRepository } from "./taskRepository.js";
import { TaskEntity } from "../../../domain/task/taskEntity.js";
import { Task } from "@prisma/client";

describe("LoginUserUsecase Test", () => {
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
    getAllTasks: jest.Mock<Promise<Task[]>, [userId: number]>;
    getTaskById: jest.Mock<Promise<Task>, [userId: number, taskId: number]>;
  };
  let taskRepository: TaskRepository;

  const task = new TaskEntity(undefined, "test", 1, 20, 23);

  const expectedDomainTask = new TaskEntity(1, "test", 1, 20, 23);

  const expectedPrismaTask = {
    id: 1,
    title: "test",
    userId: 1,
    scheduleMinnutes: 20,
    actualMinutes: 23,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    //createTaskのモック化
    mockTaskGateway = {
      createTask: jest.fn(),
      getAllTasks: jest.fn(),
      getTaskById: jest.fn(),
    };
    taskRepository = new TaskRepository(mockTaskGateway);
  });

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
