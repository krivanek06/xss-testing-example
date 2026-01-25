import { Injectable, OnModuleInit } from '@nestjs/common';
import { Candidate, candidates, employees, User } from './seed-data.model';

type DBStructure = {
  users: User[];
  candidates: Candidate[];
};

type DBKeys = keyof DBStructure;

@Injectable()
export class FakeDatabaseService implements OnModuleInit {
  private readonly db: DBStructure = {
    users: [],
    candidates: [],
  };

  onModuleInit() {
    this.seed();
  }

  add<T extends DBKeys>(key: T, value: DBStructure[T][number]): void {
    this.db[key].push(value as any);
  }

  update<T extends DBKeys>(key: T, id: string, value: Partial<DBStructure[T][number]>): void {
    const index = this.db[key].findIndex(item => item.id === id);
    if (index !== -1) {
      this.db[key][index] = { ...this.db[key][index], ...value };
    }
  }

  deleteItem<T extends DBKeys>(key: T, id: string): void {
    this.db[key] = this.db[key].filter(item => item.id !== id) as DBStructure[T];
  }

  getAllType<T extends DBKeys>(type: T): DBStructure[T] {
    return this.db[type];
  }

  getUsers(): User[] {
    return this.db.users;
  }

  getCandidates(): Candidate[] {
    return this.db.candidates;
  }

  private seed() {
    console.log('🌱 Seeding HR System Database...');

    this.db.users = employees;
    this.db.candidates = candidates;
  }
}
