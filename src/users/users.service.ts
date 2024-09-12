import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../auth';
import { OrderBy, PaginationDto } from '../common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MAIL_SERVICE } from 'src/configuration';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('User Module');
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }

  constructor(
    private readonly auth: AuthService,
    @Inject(MAIL_SERVICE) private readonly mailClient: ClientProxy,
  ) {
    super();
  }

  /**
   * @description
   * Auth login fx
   */
  async login(login: LoginDto) {
    const user = await this.user.findFirst({
      where: { username: login.username, available: true },
    });

    if (!user) throw new NotFoundException('User not found');

    const isPassword = await this.auth.comparePassword(
      login.password,
      user.password,
    );

    if (!isPassword) throw new UnauthorizedException('Wrong credentials');

    const token = await this.auth.generateJwt(user);

    return token;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const hashPassword = await this.auth.hashPassword(createUserDto.password);
      const result = await this.user.create({
        data: { ...createUserDto, password: hashPassword },
      });

      this.mailClient.emit('createMail', result);

      return result;
    } catch (error) {
      throw new BadRequestException(JSON.stringify(error));
    }
  }

  async findAll(pagination: PaginationDto) {
    const { page, limit, orderBy } = pagination;

    const totalPages = await this.user.count();

    const lastPage = Math.ceil(totalPages / limit);

    const result = {
      data: await this.user.findMany({
        where: { available: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id:
            orderBy === OrderBy.asc
              ? 'asc'
              : orderBy === OrderBy.desc
                ? 'desc'
                : 'asc',
        },
      }),
      metadata: {
        page,
        totalPages,
        lastPage,
      },
    };
    return result;
  }

  async findOne(id: string) {
    const result = await this.user.findFirst({
      where: { id, available: true },
    });

    if (!result) throw new NotFoundException('User not found');

    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { id: __, ...data } = updateUserDto;

    await this.findOne(id);

    const result = await this.user.update({ where: { id }, data });

    return result;
  }

  async remove(id: string) {
    await this.findOne(id);
    const result = await this.user.update({
      where: { id },
      data: { available: false, deletedAt: new Date() },
    });
    return result;
  }
}
