class UpdateValuationDto {
    score: number
    status: string

    constructor(data: any) {
        this.score = data.score
        this.status = data.status
    }
}

export default UpdateValuationDto