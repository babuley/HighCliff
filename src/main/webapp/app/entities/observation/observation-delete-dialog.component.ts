import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IObservation } from 'app/shared/model/observation.model';
import { ObservationService } from './observation.service';

@Component({
    selector: 'jhi-observation-delete-dialog',
    templateUrl: './observation-delete-dialog.component.html'
})
export class ObservationDeleteDialogComponent {
    observation: IObservation;

    constructor(
        protected observationService: ObservationService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.observationService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'observationListModification',
                content: 'Deleted an observation'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-observation-delete-popup',
    template: ''
})
export class ObservationDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ observation }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ObservationDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.observation = observation;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/observation', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/observation', { outlets: { popup: null } }]);
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
