import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IRecord } from 'app/shared/model/record.model';
import { RecordService } from './record.service';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-record-update',
    templateUrl: './record-update.component.html'
})
export class RecordUpdateComponent implements OnInit {
    record: IRecord;
    isSaving: boolean;

    users: IUser[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected recordService: RecordService,
        protected userService: UserService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ record }) => {
            this.record = record;
        });
        this.userService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUser[]>) => response.body)
            )
            .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.record.id !== undefined) {
            this.subscribeToSaveResponse(this.recordService.update(this.record));
        } else {
            this.subscribeToSaveResponse(this.recordService.create(this.record));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IRecord>>) {
        result.subscribe((res: HttpResponse<IRecord>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackUserById(index: number, item: IUser) {
        return item.id;
    }
}
