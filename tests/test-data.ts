
export interface TestUser {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phoneNumber?: string;
}

export const testUsers: TestUser[] = [
  {
    email: 'alice@example.com',
    password: 'Alice@1234',
    firstName: 'Alice',
    lastName: 'Nguyen',
    phoneNumber: '0901000001',
  },
  {
    email: 'bob@example.com',
    password: 'Bob@1234',
    firstName: 'Bob',
    lastName: 'Tran',
    phoneNumber: '0901000002',
  },
];
