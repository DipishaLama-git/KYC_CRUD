import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    create(dto: CreateUserDto, actor: string): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByUsername(username: string): Promise<User | null>;
    update(id: string, dto: UpdateUserDto, actor: string): Promise<User>;
    remove(id: string): Promise<void>;
    changePassword(id: string, dto: ChangePasswordDto, actor: string): Promise<void>;
}
