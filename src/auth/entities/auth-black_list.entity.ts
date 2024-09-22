import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'AuthBlackList' })
export class AuthBlackList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;
}
