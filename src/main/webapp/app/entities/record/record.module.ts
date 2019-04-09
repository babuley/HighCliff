import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { HighcliffSharedModule } from 'app/shared';
import {
    RecordComponent,
    RecordDetailComponent,
    RecordUpdateComponent,
    RecordDeletePopupComponent,
    RecordDeleteDialogComponent,
    recordRoute,
    recordPopupRoute
} from './';

const ENTITY_STATES = [...recordRoute, ...recordPopupRoute];

@NgModule({
    imports: [HighcliffSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [RecordComponent, RecordDetailComponent, RecordUpdateComponent, RecordDeleteDialogComponent, RecordDeletePopupComponent],
    entryComponents: [RecordComponent, RecordUpdateComponent, RecordDeleteDialogComponent, RecordDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HighcliffRecordModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
