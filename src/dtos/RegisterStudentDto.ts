class RegisterStudentDto {
    nrp: string;
    fullname: string;
    email: string;
    password: string;
    random: string;

    constructor(data: any) {
        this.nrp = data.nrp
        this.fullname = data.fullname
        this.email = data.email
        this.password = data.password
        this.random = data.random
    }
}

export default RegisterStudentDto