import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAppdesc3Component } from './config-appdesc3.component';

describe('ConfigAppdesc3Component', () => {
  let component: ConfigAppdesc3Component;
  let fixture: ComponentFixture<ConfigAppdesc3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigAppdesc3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigAppdesc3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
