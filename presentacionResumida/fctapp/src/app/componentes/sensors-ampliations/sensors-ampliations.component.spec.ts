import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorsAmpliationsComponent } from './sensors-ampliations.component';

describe('SensorsAmpliationsComponent', () => {
  let component: SensorsAmpliationsComponent;
  let fixture: ComponentFixture<SensorsAmpliationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensorsAmpliationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SensorsAmpliationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
