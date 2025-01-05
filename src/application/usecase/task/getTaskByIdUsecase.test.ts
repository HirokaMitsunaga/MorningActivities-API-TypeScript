import { TaskEntity } from "../../../domain/task/taskEntity.js";
import { GetTaskByIdUsecase } from "./getTaskByIdUsecase.js";

describe("GetTaskByIdUsecase Test", () => {
  let mockTaskRepository: {
    createTask: jest.Mock<Promise<TaskEntity>, [TaskEntity]>;
    getAllTasks: jest.Mock<Promise<TaskEntity[] | undefined>, [number]>;
    getTaskById: jest.Mock<Promise<TaskEntity | undefined>, [number]>;
  };

  let getTaskByIdUsecase: GetTaskByIdUsecase;

  const task = new TaskEntity(undefined, "test", 1, 20, 20);

  const expectedTask = new TaskEntity(1, "test", 1, 20, 20);

  beforeEach(() => {
    mockTaskRepository = {
      createTask: jest.fn(),
      getAllTasks: jest.fn(),
      getTaskById: jest.fn(),
    };
    getTaskByIdUsecase = new GetTaskByIdUsecase(mockTaskRepository);
  });

  const taskData = {
    userId: 1,
    taskId: 1,
  };

  it("タスク取得が成功する", async () => {
    mockTaskRepository.getTaskById.mockResolvedValue(expectedTask);
    const result = await getTaskByIdUsecase.run(
      taskData.userId,
      taskData.taskId
    );
    expect(result).toBe(expectedTask);
    expect(mockTaskRepository.getTaskById).toHaveBeenCalledWith(
      taskData.userId,
      taskData.taskId
    );
  });
  it("タスクが存在しない", async () => {
    mockTaskRepository.getAllTasks.mockResolvedValue(undefined);
    const result = await getTaskByIdUsecase.run(
      taskData.userId,
      taskData.taskId
    );
    expect(result).toBe(undefined);
  });
  it("タスク取得が失敗する", async () => {
    mockTaskRepository.getTaskById.mockRejectedValueOnce(
      new Error("Database error")
    );
    // const result = await createTaskUsecase.run(task);
    await expect(
      getTaskByIdUsecase.run(taskData.userId, taskData.taskId)
    ).rejects.toThrow("Database error");
  });
});
