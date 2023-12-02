class RegisterLectureDto {
    nip: string;
    fullname: string;
    email: string;
    password: string;
    random: string;

    constructor(data: any) {
        this.nip = data.nip;
        this.fullname = data.fullname;
        this.email = data.email;
        this.password = data.password;
        this.random = data.random;
    }
}

export default RegisterLectureDto;