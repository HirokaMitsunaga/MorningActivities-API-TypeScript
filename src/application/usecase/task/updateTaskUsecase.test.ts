import { Domain } from "domain";
import { TaskEntity } from "../../../domain/task/taskEntity.js";
import { UpdateTaskUsecase } from "./updateTaskUsecase.js";
import { DomainError } from "../../../validator/domainError.js";

describe("UpdateTaskUsecase Test", () => {
  let mockTaskRepository: {
    createTask: jest.Mock<Promise<TaskEntity>, [TaskEntity]>;
    getAllTasks: jest.Mock<Promise<TaskEntity[] | undefined>, [number]>;
    getTaskById: jest.Mock<Promise<TaskEntity | undefined>, [number]>;
    updateTask: jest.Mock<Promise<TaskEntity>, [TaskEntity]>;
    deleteTask: jest.Mock<Promise<void>, [number, number]>;
  };

  let updateTaskUsecase: UpdateTaskUsecase;

  const task = new TaskEntity(1, "test", 1, 20, 23);

  const anotherUserIdTask = new TaskEntity(1, "test", 2, 20, 23);

  const expectedTask = new TaskEntity(1, "test", 1, 20, 23);

  const undefinedTaskId = new TaskEntity(undefined, "test", 1, 20, 20);

  beforeEach(() => {
    mockTaskRepository = {
      createTask: jest.fn(),
      getAllTasks: jest.fn(),
      getTaskById: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
    };
    updateTaskUsecase = new UpdateTaskUsecase(mockTaskRepository);
  });

  it("タスク更新が成功する", async () => {
    mockTaskRepository.updateTask.mockResolvedValue(expectedTask);
    mockTaskRepository.getTaskById.mockResolvedValue(expectedTask);
    const result = await updateTaskUsecase.run(task);
    expect(result).toBe(expectedTask);
    expect(mockTaskRepository.updateTask).toHaveBeenCalledWith(task);
  });
  it("taskIdがundefined型の場合、エラーを返す", async () => {
    mockTaskRepository.getTaskById.mockResolvedValue(expectedTask);
    mockTaskRepository.updateTask.mockRejectedValueOnce(
      new Error("Database error")
    );
    await expect(updateTaskUsecase.run(undefinedTaskId)).rejects.toThrow(
      "taskId is required and must be a number"
    );
  });
  it("タスク作成者以外がタスクを更新すると失敗する", async () => {
    mockTaskRepository.updateTask.mockRejectedValueOnce(
      new DomainError("You can only update your own task")
    );
    await expect(updateTaskUsecase.run(anotherUserIdTask)).rejects.toThrow(
      "You can only update your own task"
    );
  });
  it("タスク更新が失敗する", async () => {
    mockTaskRepository.getTaskById.mockResolvedValue(expectedTask);
    mockTaskRepository.updateTask.mockRejectedValueOnce(
      new Error("Database error")
    );
    await expect(updateTaskUsecase.run(task)).rejects.toThrow("Database error");
  });
});
