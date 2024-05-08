import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAppdesc1Component } from './config-appdesc1.component';

describe('ConfigAppdesc1Component', () => {
  let component: ConfigAppdesc1Component;
  let fixture: ComponentFixture<ConfigAppdesc1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigAppdesc1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigAppdesc1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
