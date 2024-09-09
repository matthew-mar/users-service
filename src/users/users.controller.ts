import { Controller, Post, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { IsOptional } from "class-validator";



class SolveQueryDto {
    @IsOptional()
    cancel?: boolean = false;
}

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post("/solve")
    async solveProblems(@Query() query: SolveQueryDto) {
        let total = await this.usersService.countProblems();
        let solved = await this.usersService.solveProblems(query.cancel);
        return {
            "success": true,
            "total_problems": total,
            "solved_problems": solved,
        };
    }
}
