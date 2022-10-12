import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivationrecordsComponent } from './activationrecords.component';

describe('ActivationrecordsComponent', () => {
  let component: ActivationrecordsComponent;
  let fixture: ComponentFixture<ActivationrecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivationrecordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivationrecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
