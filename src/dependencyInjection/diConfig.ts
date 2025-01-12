import "reflect-metadata";
import { Container } from "inversify";

import { TYPES } from "./types.js";
import { UserGateway } from "../infrastructure/userGateway.js";
import { UserGatewayInterface } from "../domain/userGatewayInterface.js";
import { LoginUserUsecase } from "../application/usecase/auth/loginUserUsecase.js";

const diContainer = new Container();

diContainer.bind<LoginUserUsecase>(TYPES.LoginUserUsecase).to(LoginUserUsecase);
diContainer.bind<UserGatewayInterface>(TYPES.UserGateway).to(UserGateway);

export { diContainer };
