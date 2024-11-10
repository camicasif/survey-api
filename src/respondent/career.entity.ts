import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import {Respondent} from "../respondent/respondent.entity";

@Entity()
export class Career {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 255 })
    name: string;

    @Column('text')
    description: string;

    @OneToMany(() => Respondent, (respondent) => respondent.career)
    respondents: Respondent[];

}
