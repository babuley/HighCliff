import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { HighcliffSharedModule } from 'app/shared';
import {
    ObservationComponent,
    ObservationDetailComponent,
    ObservationUpdateComponent,
    ObservationDeletePopupComponent,
    ObservationDeleteDialogComponent,
    observationRoute,
    observationPopupRoute
} from './';

const ENTITY_STATES = [...observationRoute, ...observationPopupRoute];

@NgModule({
    imports: [HighcliffSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ObservationComponent,
        ObservationDetailComponent,
        ObservationUpdateComponent,
        ObservationDeleteDialogComponent,
        ObservationDeletePopupComponent
    ],
    entryComponents: [ObservationComponent, ObservationUpdateComponent, ObservationDeleteDialogComponent, ObservationDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HighcliffObservationModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
