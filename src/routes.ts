import { UserController } from "./controller/UserController"
import { validateUserId, validateUserRegistration } from './validators/validators';

export const Routes = [{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all"
}, {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one",
    validation: [validateUserId]
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "registerAndNotify",
    validation: validateUserRegistration
}
]