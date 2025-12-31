import { Injectable, OnModuleInit } from '@nestjs/common';
import { Candidate, candidates, employees, User } from './seed-data.model';

@Injectable()
export class FakeDatabaseService implements OnModuleInit {
  private readonly db = new Map<string, any>();

  onModuleInit() {
    this.seed();
  }

  get<T>(key: string): T | undefined {
    return this.db.get(key);
  }

  set(key: string, value: any): void {
    this.db.set(key, value);
  }

  getAll(): Record<string, any> {
    return Object.fromEntries(this.db);
  }

  clear(): void {
    this.db.clear();
  }

  /**
   * Helpers to get specific collections
   */
  getUsers(): User[] {
    return this.get<User[]>('users') || [];
  }

  getCandidates(): Candidate[] {
    return this.get<Candidate[]>('candidates') || [];
  }

  private seed() {
    console.log('🌱 Seeding HR System Database...');

    this.set('users', employees);
    this.set('candidates', candidates);
  }
}
