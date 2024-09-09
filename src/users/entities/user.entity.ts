import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Gender {
    MALE = "male",
    FEMALE = "female",
};

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    surname: string;

    @Column()
    age: number;

    @Column({
        type: "enum",
        enum: Gender
    })
    gender: Gender;

    @Column()
    problems: boolean;
}
