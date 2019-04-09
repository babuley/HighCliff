import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { HighcliffSharedModule } from 'app/shared';
import {
    ParameterComponent,
    ParameterDetailComponent,
    ParameterUpdateComponent,
    ParameterDeletePopupComponent,
    ParameterDeleteDialogComponent,
    parameterRoute,
    parameterPopupRoute
} from './';

const ENTITY_STATES = [...parameterRoute, ...parameterPopupRoute];

@NgModule({
    imports: [HighcliffSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ParameterComponent,
        ParameterDetailComponent,
        ParameterUpdateComponent,
        ParameterDeleteDialogComponent,
        ParameterDeletePopupComponent
    ],
    entryComponents: [ParameterComponent, ParameterUpdateComponent, ParameterDeleteDialogComponent, ParameterDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HighcliffParameterModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
