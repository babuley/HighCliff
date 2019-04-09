import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IObservation } from 'app/shared/model/observation.model';
import { ObservationService } from './observation.service';
import { IParameter } from 'app/shared/model/parameter.model';
import { ParameterService } from 'app/entities/parameter';
import { IRecord } from 'app/shared/model/record.model';
import { RecordService } from 'app/entities/record';

@Component({
    selector: 'jhi-observation-update',
    templateUrl: './observation-update.component.html'
})
export class ObservationUpdateComponent implements OnInit {
    observation: IObservation;
    isSaving: boolean;

    parameters: IParameter[];

    records: IRecord[];
    recordedWhen: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected observationService: ObservationService,
        protected parameterService: ParameterService,
        protected recordService: RecordService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ observation }) => {
            this.observation = observation;
            this.recordedWhen = this.observation.recordedWhen != null ? this.observation.recordedWhen.format(DATE_TIME_FORMAT) : null;
        });
        this.parameterService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IParameter[]>) => mayBeOk.ok),
                map((response: HttpResponse<IParameter[]>) => response.body)
            )
            .subscribe((res: IParameter[]) => (this.parameters = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.recordService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IRecord[]>) => mayBeOk.ok),
                map((response: HttpResponse<IRecord[]>) => response.body)
            )
            .subscribe((res: IRecord[]) => (this.records = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.observation.recordedWhen = this.recordedWhen != null ? moment(this.recordedWhen, DATE_TIME_FORMAT) : null;
        if (this.observation.id !== undefined) {
            this.subscribeToSaveResponse(this.observationService.update(this.observation));
        } else {
            this.subscribeToSaveResponse(this.observationService.create(this.observation));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IObservation>>) {
        result.subscribe((res: HttpResponse<IObservation>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackParameterById(index: number, item: IParameter) {
        return item.id;
    }

    trackRecordById(index: number, item: IRecord) {
        return item.id;
    }
}
