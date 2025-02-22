import { TaskEntity } from "../../../domain/task/taskEntity.js";
import { CreateTaskUsecase } from "./createTaskUsecase.js";

describe("CreateTaskUsecase Test", () => {
  let mockTaskRepository: {
    createTask: jest.Mock<Promise<TaskEntity>, [TaskEntity]>;
    getAllTasks: jest.Mock<Promise<TaskEntity[] | undefined>, [number]>;
    getTaskById: jest.Mock<Promise<TaskEntity | undefined>, [number]>;
    updateTask: jest.Mock<Promise<TaskEntity>, [TaskEntity]>;
    deleteTask: jest.Mock<Promise<void>, [number, number]>;
  };

  let createTaskUsecase: CreateTaskUsecase;

  const task = new TaskEntity(undefined, "test", 1, 20, 23);

  const expectedTask = new TaskEntity(1, "test", 1, 20, 23);

  beforeEach(() => {
    mockTaskRepository = {
      createTask: jest.fn(),
      getAllTasks: jest.fn(),
      getTaskById: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
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
