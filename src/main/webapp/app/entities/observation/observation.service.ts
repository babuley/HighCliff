import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IObservation } from 'app/shared/model/observation.model';

type EntityResponseType = HttpResponse<IObservation>;
type EntityArrayResponseType = HttpResponse<IObservation[]>;

@Injectable({ providedIn: 'root' })
export class ObservationService {
    public resourceUrl = SERVER_API_URL + 'api/observations';

    constructor(protected http: HttpClient) {}

    create(observation: IObservation): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(observation);
        return this.http
            .post<IObservation>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(observation: IObservation): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(observation);
        return this.http
            .put<IObservation>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IObservation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IObservation[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(observation: IObservation): IObservation {
        const copy: IObservation = Object.assign({}, observation, {
            recordedWhen: observation.recordedWhen != null && observation.recordedWhen.isValid() ? observation.recordedWhen.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.recordedWhen = res.body.recordedWhen != null ? moment(res.body.recordedWhen) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((observation: IObservation) => {
                observation.recordedWhen = observation.recordedWhen != null ? moment(observation.recordedWhen) : null;
            });
        }
        return res;
    }
}
