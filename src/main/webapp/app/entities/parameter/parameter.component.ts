import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IParameter } from 'app/shared/model/parameter.model';
import { AccountService } from 'app/core';
import { ParameterService } from './parameter.service';

@Component({
    selector: 'jhi-parameter',
    templateUrl: './parameter.component.html'
})
export class ParameterComponent implements OnInit, OnDestroy {
    parameters: IParameter[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected parameterService: ParameterService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.parameterService
            .query()
            .pipe(
                filter((res: HttpResponse<IParameter[]>) => res.ok),
                map((res: HttpResponse<IParameter[]>) => res.body)
            )
            .subscribe(
                (res: IParameter[]) => {
                    this.parameters = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInParameters();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IParameter) {
        return item.id;
    }

    registerChangeInParameters() {
        this.eventSubscriber = this.eventManager.subscribe('parameterListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
