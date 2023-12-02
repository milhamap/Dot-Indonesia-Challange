class UpdateSubmissionDto {
    message: string
    file: string

    constructor(data: any) {
        this.message = data.message
        this.file = data.file
    }
}

export default UpdateSubmissionDto