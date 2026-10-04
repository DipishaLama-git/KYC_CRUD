import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashPassword, verifyPassword } from '../common/password.util';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto, actor: string): Promise<User> {
    const existing = await this.usersRepository.findOne({ where: { username: dto.username } });
    if (existing) {
      throw new ConflictException('Username is already taken');
    }

    const { hash, salt } = await hashPassword(dto.password);

    const user = this.usersRepository.create({
      username: dto.username,
      passwordHash: hash,
      salt,
      firstName: dto.firstName,
      middleName: dto.middleName ?? null,
      lastName: dto.lastName,
      dateOfBirth: dto.dateOfBirth ?? null,
      createdBy: actor,
      lastUpdatedBy: actor,
    });

    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async update(id: string, dto: UpdateUserDto, actor: string): Promise<User> {
    const user = await this.findOne(id);

    Object.assign(user, {
      firstName: dto.firstName ?? user.firstName,
      middleName: dto.middleName === undefined ? user.middleName : dto.middleName,
      lastName: dto.lastName ?? user.lastName,
      dateOfBirth: dto.dateOfBirth === undefined ? user.dateOfBirth : dto.dateOfBirth,
      lastUpdatedBy: actor,
    });

    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async changePassword(id: string, dto: ChangePasswordDto, actor: string): Promise<void> {
    const user = await this.findOne(id);

    const isValid = await verifyPassword(dto.currentPassword, user.salt, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const { hash, salt } = await hashPassword(dto.newPassword);
    user.passwordHash = hash;
    user.salt = salt;
    user.lastUpdatedBy = actor;

    await this.usersRepository.save(user);
  }
}
