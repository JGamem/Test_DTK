import { Container } from 'typedi';
import { VehicleService } from './services/vehicle.service';
import { GroupService } from './services/group.service';
import { VehicleController } from './controllers/vehicle.controller';
import { GroupController } from './controllers/group.controller';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { AuthController } from './controllers/auth.controller';

Container.set(UserService, new UserService());
Container.set(VehicleService, new VehicleService());
Container.set(GroupService, new GroupService());

Container.set(AuthService, new AuthService(
    Container.get(UserService)
));

Container.set(VehicleController, new VehicleController(
    Container.get(VehicleService)
));
Container.set(GroupController, new GroupController(
    Container.get(GroupService)
));

Container.set(AuthController, new AuthController(
    Container.get(AuthService)
));

export { Container };