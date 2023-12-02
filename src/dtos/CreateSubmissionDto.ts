class CreateSubmissionDto {
    random: string;
    message: string;
    file: string;
    assignment_id: number;
    user_id: number;

    constructor(data: any) {
        this.random = data.random
        this.message = data.message
        this.file = data.file
        this.assignment_id = data.assignment_id
        this.user_id = data.use
    }
}

export default CreateSubmissionDto