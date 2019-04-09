import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IRecord } from 'app/shared/model/record.model';
import { AccountService } from 'app/core';
import { RecordService } from './record.service';

@Component({
    selector: 'jhi-record',
    templateUrl: './record.component.html'
})
export class RecordComponent implements OnInit, OnDestroy {
    records: IRecord[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected recordService: RecordService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.recordService
            .query()
            .pipe(
                filter((res: HttpResponse<IRecord[]>) => res.ok),
                map((res: HttpResponse<IRecord[]>) => res.body)
            )
            .subscribe(
                (res: IRecord[]) => {
                    this.records = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInRecords();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IRecord) {
        return item.id;
    }

    registerChangeInRecords() {
        this.eventSubscriber = this.eventManager.subscribe('recordListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
