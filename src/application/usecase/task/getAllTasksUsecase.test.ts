import { TaskEntity } from "../../../domain/task/taskEntity.js";
import { GetAllTasksUsecase } from "./getAllTasksUsecase.js";

describe("GetAllTasksUsecase Test", () => {
  let mockTaskRepository: {
    createTask: jest.Mock<Promise<TaskEntity>, [TaskEntity]>;
    getAllTasks: jest.Mock<Promise<TaskEntity[] | undefined>, [number]>;
    getTaskById: jest.Mock<Promise<TaskEntity | undefined>, [number]>;
    updateTask: jest.Mock<Promise<TaskEntity>, [TaskEntity]>;
  };

  let getAllTasksUsecase: GetAllTasksUsecase;

  const task = new TaskEntity(undefined, "test", 1, 20, 20);

  const expectedTask = new TaskEntity(1, "test", 1, 20, 20);

  beforeEach(() => {
    mockTaskRepository = {
      createTask: jest.fn(),
      getAllTasks: jest.fn(),
      getTaskById: jest.fn(),
      updateTask: jest.fn(),
    };
    getAllTasksUsecase = new GetAllTasksUsecase(mockTaskRepository);
  });

  const expectedTasks = [
    new TaskEntity(
      expectedTask.id,
      expectedTask.title,
      expectedTask.userId,
      expectedTask.scheduleMinnutes,
      expectedTask.actualMinutes
    ),
  ];

  it("タスク取得が成功する", async () => {
    mockTaskRepository.getAllTasks.mockResolvedValue(expectedTasks);
    const result = await getAllTasksUsecase.run(task.userId);
    expect(result).toBe(expectedTasks);
    expect(mockTaskRepository.getAllTasks).toHaveBeenCalledWith(task.userId);
  });
  it("タスクが存在しない", async () => {
    mockTaskRepository.getAllTasks.mockResolvedValue(undefined);
    const result = await getAllTasksUsecase.run(task.userId);
    expect(result).toBe(undefined);
  });
  it("タスク取得が失敗する", async () => {
    mockTaskRepository.getAllTasks.mockRejectedValueOnce(
      new Error("Database error")
    );
    // const result = await createTaskUsecase.run(task);
    await expect(getAllTasksUsecase.run(task.userId)).rejects.toThrow(
      "Database error"
    );
  });
});
