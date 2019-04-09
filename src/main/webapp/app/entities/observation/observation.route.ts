import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Observation } from 'app/shared/model/observation.model';
import { ObservationService } from './observation.service';
import { ObservationComponent } from './observation.component';
import { ObservationDetailComponent } from './observation-detail.component';
import { ObservationUpdateComponent } from './observation-update.component';
import { ObservationDeletePopupComponent } from './observation-delete-dialog.component';
import { IObservation } from 'app/shared/model/observation.model';

@Injectable({ providedIn: 'root' })
export class ObservationResolve implements Resolve<IObservation> {
    constructor(private service: ObservationService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IObservation> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Observation>) => response.ok),
                map((observation: HttpResponse<Observation>) => observation.body)
            );
        }
        return of(new Observation());
    }
}

export const observationRoute: Routes = [
    {
        path: '',
        component: ObservationComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'highcliffApp.observation.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ObservationDetailComponent,
        resolve: {
            observation: ObservationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'highcliffApp.observation.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ObservationUpdateComponent,
        resolve: {
            observation: ObservationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'highcliffApp.observation.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ObservationUpdateComponent,
        resolve: {
            observation: ObservationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'highcliffApp.observation.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const observationPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ObservationDeletePopupComponent,
        resolve: {
            observation: ObservationResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'highcliffApp.observation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
