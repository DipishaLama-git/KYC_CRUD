import { CreateUserDto } from '../users/dto/create-user.dto';
import { ChangePasswordDto } from '../users/dto/change-password.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import type { AuthenticatedUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    register(dto: CreateUserDto): Promise<import("../users/entities/user.entity").User>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
    }>;
    changePassword(currentUser: AuthenticatedUser, dto: ChangePasswordDto): Promise<void>;
}
