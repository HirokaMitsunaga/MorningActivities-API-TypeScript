import { Task } from "../../domain/task/task.js";
import { CreateTaskUsecase } from "./createTaskUsecase.js";

describe("CreateTaskUsecase Test", () => {
  let mockTaskRepository: {
    createTask: jest.Mock<Promise<Task>, [Task]>;
  };

  let createTaskUsecase: CreateTaskUsecase;

  const task = new Task(undefined, "test", 1, 20, 23);

  const expectedTask = new Task(1, "test", 1, 20, 23);

  beforeEach(() => {
    mockTaskRepository = {
      createTask: jest.fn(),
    };
    createTaskUsecase = new CreateTaskUsecase(mockTaskRepository);
  });

  it("タスク作成が成功する", async () => {
    mockTaskRepository.createTask.mockResolvedValue(expectedTask);
    const result = await createTaskUsecase.run(task);
    expect(result).toBe(expectedTask);
    expect(mockTaskRepository.createTask).toHaveBeenCalledWith(task);
  });
  it("タスク作成が失敗する", async () => {
    mockTaskRepository.createTask.mockRejectedValueOnce(
      new Error("Database error")
    );
    // const result = await createTaskUsecase.run(task);
    await expect(createTaskUsecase.run(task)).rejects.toThrow("Database error");
  });
});
