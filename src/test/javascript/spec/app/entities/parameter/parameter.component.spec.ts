/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { HighcliffTestModule } from '../../../test.module';
import { ParameterComponent } from 'app/entities/parameter/parameter.component';
import { ParameterService } from 'app/entities/parameter/parameter.service';
import { Parameter } from 'app/shared/model/parameter.model';

describe('Component Tests', () => {
    describe('Parameter Management Component', () => {
        let comp: ParameterComponent;
        let fixture: ComponentFixture<ParameterComponent>;
        let service: ParameterService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HighcliffTestModule],
                declarations: [ParameterComponent],
                providers: []
            })
                .overrideTemplate(ParameterComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ParameterComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ParameterService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Parameter(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.parameters[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
