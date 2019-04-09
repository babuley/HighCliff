/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { ObservationService } from 'app/entities/observation/observation.service';
import { IObservation, Observation, ObservationStatus } from 'app/shared/model/observation.model';

describe('Service Tests', () => {
    describe('Observation Service', () => {
        let injector: TestBed;
        let service: ObservationService;
        let httpMock: HttpTestingController;
        let elemDefault: IObservation;
        let currentDate: moment.Moment;
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule]
            });
            injector = getTestBed();
            service = injector.get(ObservationService);
            httpMock = injector.get(HttpTestingController);
            currentDate = moment();

            elemDefault = new Observation(0, ObservationStatus.Recorded, 'AAAAAAA', 0, false, 0, 'AAAAAAA', currentDate);
        });

        describe('Service methods', async () => {
            it('should find an element', async () => {
                const returnedFromService = Object.assign(
                    {
                        recordedWhen: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );
                service
                    .find(123)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: elemDefault }));

                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should create a Observation', async () => {
                const returnedFromService = Object.assign(
                    {
                        id: 0,
                        recordedWhen: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        recordedWhen: currentDate
                    },
                    returnedFromService
                );
                service
                    .create(new Observation(null))
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'POST' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should update a Observation', async () => {
                const returnedFromService = Object.assign(
                    {
                        status: 'BBBBBB',
                        comment: 'BBBBBB',
                        floatValue: 1,
                        booleanValue: true,
                        intValue: 1,
                        stringValue: 'BBBBBB',
                        recordedWhen: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );

                const expected = Object.assign(
                    {
                        recordedWhen: currentDate
                    },
                    returnedFromService
                );
                service
                    .update(expected)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'PUT' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should return a list of Observation', async () => {
                const returnedFromService = Object.assign(
                    {
                        status: 'BBBBBB',
                        comment: 'BBBBBB',
                        floatValue: 1,
                        booleanValue: true,
                        intValue: 1,
                        stringValue: 'BBBBBB',
                        recordedWhen: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        recordedWhen: currentDate
                    },
                    returnedFromService
                );
                service
                    .query(expected)
                    .pipe(
                        take(1),
                        map(resp => resp.body)
                    )
                    .subscribe(body => expect(body).toContainEqual(expected));
                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify([returnedFromService]));
                httpMock.verify();
            });

            it('should delete a Observation', async () => {
                const rxPromise = service.delete(123).subscribe(resp => expect(resp.ok));

                const req = httpMock.expectOne({ method: 'DELETE' });
                req.flush({ status: 200 });
            });
        });

        afterEach(() => {
            httpMock.verify();
        });
    });
});
