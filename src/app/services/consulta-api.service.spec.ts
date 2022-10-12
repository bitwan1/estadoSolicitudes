import { TestBed } from '@angular/core/testing';

import { ConsultaApiService } from './consulta-api.service';

describe('ConsultaApiService', () => {
  let service: ConsultaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
