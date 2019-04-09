import { IUser } from 'app/core/user/user.model';

export interface IRecord {
    id?: number;
    recordId?: number;
    userId?: IUser;
}

export class Record implements IRecord {
    constructor(public id?: number, public recordId?: number, public userId?: IUser) {}
}
