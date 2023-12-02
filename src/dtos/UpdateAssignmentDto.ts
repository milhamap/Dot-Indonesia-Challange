class UpdateAssignmentDto {
    title: string;
    description: string;
    file: string;
    deadline: string;

    constructor(data: any) {
        this.title = data.title
        this.description = data.description
        this.file = data.file
        this.deadline = data.deadline
    }
}

export default UpdateAssignmentDto