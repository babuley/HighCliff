import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Record } from 'app/shared/model/record.model';
import { RecordService } from './record.service';
import { RecordComponent } from './record.component';
import { RecordDetailComponent } from './record-detail.component';
import { RecordUpdateComponent } from './record-update.component';
import { RecordDeletePopupComponent } from './record-delete-dialog.component';
import { IRecord } from 'app/shared/model/record.model';

@Injectable({ providedIn: 'root' })
export class RecordResolve implements Resolve<IRecord> {
    constructor(private service: RecordService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IRecord> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Record>) => response.ok),
                map((record: HttpResponse<Record>) => record.body)
            );
        }
        return of(new Record());
    }
}

export const recordRoute: Routes = [
    {
        path: '',
        component: RecordComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'highcliffApp.record.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: RecordDetailComponent,
        resolve: {
            record: RecordResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'highcliffApp.record.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: RecordUpdateComponent,
        resolve: {
            record: RecordResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'highcliffApp.record.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: RecordUpdateComponent,
        resolve: {
            record: RecordResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'highcliffApp.record.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const recordPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: RecordDeletePopupComponent,
        resolve: {
            record: RecordResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'highcliffApp.record.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
