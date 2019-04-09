import { Moment } from 'moment';
import { IParameter } from 'app/shared/model/parameter.model';
import { IRecord } from 'app/shared/model/record.model';

export const enum ObservationStatus {
    Recorded = 'Recorded',
    Invalid = 'Invalid',
    Removed = 'Removed',
    NotRecorded = 'NotRecorded',
    RecordedInError = 'RecordedInError'
}

export interface IObservation {
    id?: number;
    status?: ObservationStatus;
    comment?: string;
    floatValue?: number;
    booleanValue?: boolean;
    intValue?: number;
    stringValue?: string;
    recordedWhen?: Moment;
    parameter?: IParameter;
    record?: IRecord;
}

export class Observation implements IObservation {
    constructor(
        public id?: number,
        public status?: ObservationStatus,
        public comment?: string,
        public floatValue?: number,
        public booleanValue?: boolean,
        public intValue?: number,
        public stringValue?: string,
        public recordedWhen?: Moment,
        public parameter?: IParameter,
        public record?: IRecord
    ) {
        this.booleanValue = this.booleanValue || false;
    }
}
