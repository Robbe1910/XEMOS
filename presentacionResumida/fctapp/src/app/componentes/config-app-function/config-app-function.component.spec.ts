import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAppFunctionComponent } from './config-app-function.component';

describe('ConfigAppFunctionComponent', () => {
  let component: ConfigAppFunctionComponent;
  let fixture: ComponentFixture<ConfigAppFunctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigAppFunctionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigAppFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
