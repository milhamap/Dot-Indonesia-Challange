class CreateAssignmentDto {
    random: string;
    title: string;
    description: string;
    file: string;
    deadline: string;
    user_id: number;

    constructor(data: any) {
        this.random = data.random
        this.title = data.title
        this.description = data.description
        this.file = data.file
        this.deadline = data.deadline
        this.user_id = data.user_id
    }
}

export default CreateAssignmentDto