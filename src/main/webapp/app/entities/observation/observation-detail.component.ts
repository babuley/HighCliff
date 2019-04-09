import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IObservation } from 'app/shared/model/observation.model';

@Component({
    selector: 'jhi-observation-detail',
    templateUrl: './observation-detail.component.html'
})
export class ObservationDetailComponent implements OnInit {
    observation: IObservation;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ observation }) => {
            this.observation = observation;
        });
    }

    previousState() {
        window.history.back();
    }
}
