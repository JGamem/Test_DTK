import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { RegisterDto } from '../dtos/auth.dto';
import { Service } from 'typedi';
import { AppError } from '../utils/app-error';
import { createHash } from 'crypto';

@Service()
export class UserService {
    async findByUsername(username: string): Promise<User | null> {
        return UserRepository.findOne({ where: { username } });
    }

    async create(userData: RegisterDto): Promise<User> {
        const existingUser = await UserRepository.findOne({
            where: [
                { username: userData.username },
                { email: userData.email }
            ]
        });

        if (existingUser) {
            throw new AppError('User already exists', 409);
        }

        const hashedPassword = this.hashPassword(userData.password);

        const newUser = UserRepository.create({
            ...userData,
            password: hashedPassword
        });

        return UserRepository.save(newUser);
    }

    hashPassword(password: string): string {
        return createHash('sha256').update(password).digest('hex');
    }

    verifyPassword(plainPassword: string, hashedPassword: string): boolean {
        const hash = this.hashPassword(plainPassword);
        return hash === hashedPassword;
    }
}