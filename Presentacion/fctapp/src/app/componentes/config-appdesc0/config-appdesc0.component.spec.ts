import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAppdesc0Component } from './config-appdesc0.component';

describe('ConfigAppdesc0Component', () => {
  let component: ConfigAppdesc0Component;
  let fixture: ComponentFixture<ConfigAppdesc0Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigAppdesc0Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigAppdesc0Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
