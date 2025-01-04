import { TaskRepository } from "./taskRepository.js";
import { Task } from "../../../domain/task/task.js";

describe("LoginUserUsecase Test", () => {
  //モックの型定義
  let mockTaskGateway: {
    createTask: jest.Mock<
      Promise<{
        //prisimaのTask型にしたいけど、domainのTaskと被るためprisimaの型を直書き
        id: number;
        title: string;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        scheduleMinnutes: number | null;
        actualMinutes: number | null;
      }>,
      [
        title: string,
        userId: number,
        scheduleMinnutes: number | null,
        actualMinutes: number | null
      ]
    >;
  };
  let taskRepository: TaskRepository;

  const task = new Task(undefined, "test", 1, 20, 23);

  const expectedDomainTask = new Task(1, "test", 1, 20, 23);

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
