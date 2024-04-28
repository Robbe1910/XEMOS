import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdsFinalComponent } from './ods-final.component';

describe('OdsFinalComponent', () => {
  let component: OdsFinalComponent;
  let fixture: ComponentFixture<OdsFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdsFinalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OdsFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
