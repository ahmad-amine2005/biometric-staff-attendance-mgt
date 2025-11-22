import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceRecords } from './attendance-records';

describe('AttendanceRecords', () => {
  let component: AttendanceRecords;
  let fixture: ComponentFixture<AttendanceRecords>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceRecords]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceRecords);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
