import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Gender, User } from "../users/entities/user.entity";
import { Repository } from "typeorm";
import { faker } from '@faker-js/faker';
import { randomInt } from "crypto";

@Injectable()
export class DbSeederService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    public async seed(): Promise<void> {
        const chunkSize = 1000;
        const chunksCount = 1000;

        await this.userRepository.manager.transaction(async manager => {
            for (let i = 0; i < chunksCount; i++) {
                let chunk = [];
                for (let j = 0; j < chunkSize; j++) {
                    let user = new User();
                    user.name = faker.person.firstName();
                    user.surname = faker.person.lastName();
                    user.age = randomInt(18, 100);
                    user.gender = Math.random() < 0.5 ? Gender.FEMALE : Gender.MALE;
                    user.problems = Math.random() < 0.5;
                    chunk.push(user);
                }
                await manager.save(chunk);
            }
        })
        

        console.log('Database seeding completed.');
    }
}
