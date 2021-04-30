import HttpException from "./HttpException";

export class MaximumIndexLetterVersionReached extends HttpException{
    constructor() {
        super(400, "Index version letters exceeded");

    }
}
