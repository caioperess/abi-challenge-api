import { User, UserProps } from '@/domain/users/application/entities/user';
import { faker } from '@faker-js/faker';

export function makeUser(override: Partial<UserProps> = {}, id?: string) {
  const student = User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  );

  return student;
}
