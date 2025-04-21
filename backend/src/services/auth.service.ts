import { Service } from 'typedi';
import jwt from 'jsonwebtoken';
import { UserService } from './user.service';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { AppError } from '../utils/app-error';
import { User } from '../entities/user.entity';

@Service()
export class AuthService {
    constructor(private userService: UserService) { }

    async login(credentials: LoginDto): Promise<{ token: string; user: Partial<User> }> {
        const user = await this.userService.findByUsername(credentials.username);

        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        const isPasswordValid = this.userService.verifyPassword(
            credentials.password,
            user.password
        );

        if (!isPasswordValid) {
            throw new AppError('Invalid credentials', 401);
        }

        const token = this.generateToken(user);

        const { password, ...userWithoutPassword } = user;

        return {
            token,
            user: userWithoutPassword
        };
    }

    async register(userData: RegisterDto): Promise<{ token: string; user: Partial<User> }> {
        const newUser = await this.userService.create(userData);

        const token = this.generateToken(newUser);

        const { password, ...userWithoutPassword } = newUser;

        return {
            token,
            user: userWithoutPassword
        };
    }

    private generateToken(user: User): string {
        const payload = {
            sub: user.id,
            username: user.username,
        };

        return jwt.sign(payload, process.env.JWT_SECRET!, {
            expiresIn: '1d'
        });
    }

    verifyToken(token: string): any {
        try {
            return jwt.verify(token, process.env.JWT_SECRET!,);
        } catch (error) {
            throw new AppError('Invalid token', 401);
        }
    }
}