import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IObservation } from 'app/shared/model/observation.model';
import { AccountService } from 'app/core';
import { ObservationService } from './observation.service';

@Component({
    selector: 'jhi-observation',
    templateUrl: './observation.component.html'
})
export class ObservationComponent implements OnInit, OnDestroy {
    observations: IObservation[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected observationService: ObservationService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.observationService
            .query()
            .pipe(
                filter((res: HttpResponse<IObservation[]>) => res.ok),
                map((res: HttpResponse<IObservation[]>) => res.body)
            )
            .subscribe(
                (res: IObservation[]) => {
                    this.observations = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInObservations();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IObservation) {
        return item.id;
    }

    registerChangeInObservations() {
        this.eventSubscriber = this.eventManager.subscribe('observationListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
