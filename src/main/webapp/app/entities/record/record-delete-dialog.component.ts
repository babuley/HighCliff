import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IRecord } from 'app/shared/model/record.model';
import { RecordService } from './record.service';

@Component({
    selector: 'jhi-record-delete-dialog',
    templateUrl: './record-delete-dialog.component.html'
})
export class RecordDeleteDialogComponent {
    record: IRecord;

    constructor(protected recordService: RecordService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.recordService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'recordListModification',
                content: 'Deleted an record'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-record-delete-popup',
    template: ''
})
export class RecordDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ record }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(RecordDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.record = record;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/record', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/record', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
