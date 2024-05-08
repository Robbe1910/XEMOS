import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAppdesc2Component } from './config-appdesc2.component';

describe('ConfigAppdesc2Component', () => {
  let component: ConfigAppdesc2Component;
  let fixture: ComponentFixture<ConfigAppdesc2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigAppdesc2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigAppdesc2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
