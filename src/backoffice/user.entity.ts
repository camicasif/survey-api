import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }
}
