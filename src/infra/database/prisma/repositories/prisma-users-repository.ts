import { User } from '@/domain/users/application/entities/user';
import { UsersRepository } from '@/domain/users/application/repositories/users-repository';
import { CacheRepository } from '@/infra/cache/cache-repository';
import { Injectable } from '@nestjs/common';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheRepository,
  ) {}

  async create(user: User): Promise<void> {
    const raw = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.create({
      data: raw,
    });
  }

  async findById(id: string): Promise<User | null> {
    const cacheHit = await this.cache.get(`user:${id}`);

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit);

      return PrismaUserMapper.toDomain(cacheData);
    }

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      return null;
    }

    await this.cache.set(`user:${id}`, JSON.stringify(user));

    return PrismaUserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({ where: { email } });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();

    return users.map((user) => PrismaUserMapper.toDomain(user));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });

    await this.cache.delete(`user:${id}`);
  }

  async save(user: User): Promise<void> {
    const raw = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.update({
      where: {
        id: raw.id,
      },
      data: raw,
    });

    await this.cache.delete(`user:${raw.id}`);
  }
}
