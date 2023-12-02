class ResponseFormat
{
    constructor(public status: number, public message: string, public data: any = null)
    {
    }
    public static success(status: number, message: string = 'Success')
    {
        return new ResponseFormat(status, message);
    }

    public static error(status: number, message: string = 'Error')
    {
        return new ResponseFormat(status, message);
    }

    public static resource(status: number, message: string = 'Success', data: any)
    {
        return new ResponseFormat(status, message, data);
    }
}

export default ResponseFormat;