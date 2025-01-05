import { TaskEntity } from "../../../domain/task/taskEntity.js";
import { DeleteTaskUsecase } from "./deleteTaskUsecase.js";

describe("DeleteTaskUsecase Test", () => {
  let mockTaskRepository: {
    createTask: jest.Mock<Promise<TaskEntity>, [TaskEntity]>;
    getAllTasks: jest.Mock<Promise<TaskEntity[] | undefined>, [number]>;
    getTaskById: jest.Mock<Promise<TaskEntity | undefined>, [number]>;
    updateTask: jest.Mock<Promise<TaskEntity>, [TaskEntity]>;
    deleteTask: jest.Mock<Promise<void>, [number, number]>;
  };

  let deleteTaskUsecase: DeleteTaskUsecase;

  const mockTask = new TaskEntity(1, "test", 1, 20, 20);

  beforeEach(() => {
    mockTaskRepository = {
      createTask: jest.fn(),
      getAllTasks: jest.fn(),
      getTaskById: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
    };
    deleteTaskUsecase = new DeleteTaskUsecase(mockTaskRepository);
  });

  const taskData = {
    userId: 1,
    taskId: 1,
  };

  it("タスク削除が成功する", async () => {
    mockTaskRepository.getTaskById.mockResolvedValue(mockTask);
    mockTaskRepository.deleteTask.mockResolvedValue(undefined);

    await deleteTaskUsecase.run(taskData.userId, taskData.taskId);
    expect(mockTaskRepository.deleteTask).toHaveBeenCalledWith(
      taskData.userId,
      taskData.taskId
    );
  });

  it("タスク削除が失敗する", async () => {
    mockTaskRepository.getTaskById.mockResolvedValue(mockTask);
    mockTaskRepository.deleteTask.mockRejectedValueOnce(
      new Error("Database error")
    );
    // const result = await createTaskUsecase.run(task);
    await expect(
      deleteTaskUsecase.run(taskData.userId, taskData.taskId)
    ).rejects.toThrow("Database error");
  });
});
