import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { DataSource, EntityManager, Repository } from "typeorm";
import { fa } from "@faker-js/faker";

@Injectable()
export class UsersService {
    private problemGen?: AsyncGenerator<number, void, unknown>;

    private currentProblemCount: number = 0;

    private cancel: boolean = false;

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private dataSource: DataSource
    ) {}

    public async solveProblems(cancel: boolean): Promise<number|void> {
        this.cancel = cancel;
        if (! this.problemGen) {
            this.currentProblemCount = 0;
            this.problemGen = this.update(cancel);
            this.runUpdate(cancel);
        }
        return this.currentProblemCount;
    }

    public async countProblems(): Promise<number> {
        return await this.userRepository.count({
            where: {
                problems: true,
            }
        });
    }

    private async runUpdate(cancel: boolean) {
        if (! this.problemGen) {
            return;
        }
        for await (let upd of this.problemGen) {
            if (cancel) {
                break;
            }
            this.currentProblemCount = upd;
        }
        this.problemGen = null;
    }

    private async *update(cancel: boolean) {
        const chunkSize = 1000;
        let updated = 0;
        let updateLock = false;

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            

            let skip = 0;
            while (true) {
                if (this.cancel) {
                    throw new Error("cancel transaction");
                }

                console.log("here");
                if (updateLock) {
                    console.log("update lock");
                    yield updated;
                }

                console.log("no update lock");

                updateLock = true;
                const users = await this.userRepository.createQueryBuilder("users")
                    .where("users.problems = :problems", {problems: true})
                    .orderBy("users.id", "ASC")
                    .skip(skip)
                    .take(chunkSize)
                    .getMany();

                if (users.length === 0) {
                    console.log("break");
                    break;
                }

                users.map(user => user.problems = false);

                await queryRunner.manager.save(users);
                updated += users.length;
                console.log(updated);
                skip += chunkSize;
                updateLock = false;
                console.log("return updated");
                yield updated;
            }

            await queryRunner.commitTransaction();
            yield updated;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            console.log("transtaction rolled back");
            yield updated;
        } finally {
            console.log("release");
            await queryRunner.release();
            yield updated;
        }
    }

    // async solveProblems(): Promise<number> {
    //     let updated = 0;
        
    //     await this.userRepository.manager.transaction(async manager => {
    //         const chunkSize = 1000;
    //         let skip = 0;

    //         while (true) {
    //             const users = await this.userRepository.createQueryBuilder("users")
    //                 .where("users.problems = :problems", {problems: true})
    //                 .orderBy("users.id", "ASC")
    //                 .skip(skip)
    //                 .take(chunkSize)
    //                 .getMany();

    //             if (users.length === 0) {
    //                 break;
    //             }

    //             users.map(user => user.problems = false);

    //             await manager.save(users);
    //             updated += users.length;

    //             console.log(updated);

    //             skip += chunkSize;
    //         }
    //     })

    //     return updated;
    // }

    // private async *solveGenerator(cancel: boolean) {
    //     let currentUpdated = 0;
    //     const chunkSize = 1000;

    //     if (currentUpdated < chunkSize) {
    //         yield currentUpdated;
    //     }

    //     async function *update(manager: EntityManager) {
    //         if (cancel) {
    //             throw new Error("Cancel Transaction");
    //         }

    //         let updated = 0;
    //         let skip = 0;

    //         while (true) {
    //             const users = await this.userRepository
    //                 .createQueryBuilder("users")
    //                 .where("users.problems = :problems")
    //                 .orderBy("users.id", "ASC")
    //                 .skip(skip)
    //                 .take(chunkSize)
    //                 .getMany();

    //             if (users.length === 0) {
    //                 break;
    //             }

    //             users.map(user => {
    //                 user.problems = false;
    //                 currentUpdated += 1;
    //             });

    //             await manager.save(users);
    //             updated += users.length;
    //             skip += chunkSize;
    //             yield updated;
    //         }
    //     };

    //     return await this.userRepository.manager.transaction(update).catch(error => {
    //         console.log("rollback");
    //     });
    // }
}
