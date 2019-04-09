import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Parameter } from 'app/shared/model/parameter.model';
import { ParameterService } from './parameter.service';
import { ParameterComponent } from './parameter.component';
import { ParameterDetailComponent } from './parameter-detail.component';
import { ParameterUpdateComponent } from './parameter-update.component';
import { ParameterDeletePopupComponent } from './parameter-delete-dialog.component';
import { IParameter } from 'app/shared/model/parameter.model';

@Injectable({ providedIn: 'root' })
export class ParameterResolve implements Resolve<IParameter> {
    constructor(private service: ParameterService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IParameter> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Parameter>) => response.ok),
                map((parameter: HttpResponse<Parameter>) => parameter.body)
            );
        }
        return of(new Parameter());
    }
}

export const parameterRoute: Routes = [
    {
        path: '',
        component: ParameterComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'highcliffApp.parameter.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ParameterDetailComponent,
        resolve: {
            parameter: ParameterResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'highcliffApp.parameter.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ParameterUpdateComponent,
        resolve: {
            parameter: ParameterResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'highcliffApp.parameter.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ParameterUpdateComponent,
        resolve: {
            parameter: ParameterResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'highcliffApp.parameter.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const parameterPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ParameterDeletePopupComponent,
        resolve: {
            parameter: ParameterResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'highcliffApp.parameter.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
