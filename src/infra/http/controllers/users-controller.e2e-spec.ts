import { AppModule } from '@/app.module';
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { UserFactory } from '@test/factories/make-user';
import request from 'supertest';

describe('Users E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let jwt: JwtService;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    const user = await userFactory.makePrismaUser();

    accessToken = jwt.sign({ sub: user.id });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  test('[GET] /users', async () => {
    await userFactory.makePrismaUser({
      name: 'Test GET All users 01',
      email: 'test-get-all-users-01@example.com',
    });

    await userFactory.makePrismaUser({
      name: 'Test GET All users 02',
      email: 'test-get-all-users-02@example.com',
    });

    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Test GET All users 01',
          email: 'test-get-all-users-01@example.com',
        }),
        expect.objectContaining({
          name: 'Test GET All users 02',
          email: 'test-get-all-users-02@example.com',
        }),
      ]),
    );
  });

  test('[GET] /users/:id', async () => {
    const user = await userFactory.makePrismaUser({
      name: 'Test GET User by ID',
      email: 'test-get-user-by-id@example.com',
    });

    const response = await request(app.getHttpServer())
      .get(`/users/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual(
      expect.objectContaining({
        id: user.id,
        name: 'Test GET User by ID',
        email: 'test-get-user-by-id@example.com',
      }),
    );
  });

  test('[POST] /users', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test POST User',
        email: 'test-post-user@example.com',
        password: '123456',
      });

    expect(response.statusCode).toBe(201);

    const userInDatabase = await prisma.user.findFirst({
      where: {
        email: 'test-post-user@example.com',
      },
    });

    expect(userInDatabase).toBeTruthy();
  });

  test('[PUT] /users/:id', async () => {
    const user = await userFactory.makePrismaUser({
      name: 'Test PUT User by ID',
      email: 'test-put-user-by-id@example.com',
    });

    const response = await request(app.getHttpServer())
      .put(`/users/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test PUT User by ID updated',
        email: 'test-put-user-by-id-updated@example.com',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual(
      expect.objectContaining({
        id: user.id,
        name: 'Test PUT User by ID updated',
        email: 'test-put-user-by-id-updated@example.com',
      }),
    );

    const userInDatabase = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    expect(userInDatabase).toEqual(
      expect.objectContaining({
        id: user.id,
        name: 'Test PUT User by ID updated',
        email: 'test-put-user-by-id-updated@example.com',
      }),
    );
  });

  test('[DELETE] /users/:id', async () => {
    const user = await userFactory.makePrismaUser({
      name: 'Test DELETE User by ID',
      email: 'test-delete-user-by-id@example.com',
    });

    const response = await request(app.getHttpServer())
      .delete(`/users/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);

    const userInDatabase = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    expect(userInDatabase).toBeNull();
  });

  test('[POST] /users/authenticate', async () => {
    await userFactory.makePrismaUser({
      name: 'Test Authenticate User',
      email: 'test-authenticate-user@example.com',
      password: await new BcryptHasher().hash('123456'),
    });

    const response = await request(app.getHttpServer())
      .post('/users/authenticate')
      .send({
        email: 'test-authenticate-user@example.com',
        password: '123456',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      }),
    );
  });
});
