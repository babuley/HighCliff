import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IParameter } from 'app/shared/model/parameter.model';
import { ParameterService } from './parameter.service';

@Component({
    selector: 'jhi-parameter-update',
    templateUrl: './parameter-update.component.html'
})
export class ParameterUpdateComponent implements OnInit {
    parameter: IParameter;
    isSaving: boolean;

    constructor(protected parameterService: ParameterService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ parameter }) => {
            this.parameter = parameter;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.parameter.id !== undefined) {
            this.subscribeToSaveResponse(this.parameterService.update(this.parameter));
        } else {
            this.subscribeToSaveResponse(this.parameterService.create(this.parameter));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IParameter>>) {
        result.subscribe((res: HttpResponse<IParameter>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
