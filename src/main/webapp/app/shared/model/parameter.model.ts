export const enum Unit {
    Kg = 'Kg',
    MM = 'MM',
    Percent = 'Percent',
    MMHg = 'MMHg',
    Centigrade = 'Centigrade',
    KPa = 'KPa',
    YesNo = 'YesNo',
    Litres = 'Litres',
    Text = 'Text',
    BPM = 'BPM',
    RPM = 'RPM'
}

export interface IParameter {
    id?: number;
    min?: number;
    max?: number;
    displayPrecision?: number;
    unit?: Unit;
    parameterName?: string;
}

export class Parameter implements IParameter {
    constructor(
        public id?: number,
        public min?: number,
        public max?: number,
        public displayPrecision?: number,
        public unit?: Unit,
        public parameterName?: string
    ) {}
}
