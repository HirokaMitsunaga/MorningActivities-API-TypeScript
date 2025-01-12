import "reflect-metadata";
import { Container } from "inversify";
import { PrismaClient } from "@prisma/client";

import { TYPES } from "./types.js";
import { UserGateway } from "../infrastructure/userGateway.js";
import { UserGatewayInterface } from "../domain/userGatewayInterface.js";
import { LoginUserUsecase } from "../application/usecase/auth/loginUserUsecase.js";
import { ILogger, Logger } from "../utils/logger.js";

const diContainer = new Container();
const prismaClient = new PrismaClient();

diContainer
  .bind<PrismaClient>(TYPES.PrismaClient)
  .toConstantValue(prismaClient);
diContainer.bind<LoginUserUsecase>(TYPES.LoginUserUsecase).to(LoginUserUsecase);
diContainer.bind<UserGatewayInterface>(TYPES.UserGateway).to(UserGateway);
diContainer.bind<ILogger>(TYPES.Logger).to(Logger);

export { diContainer };
