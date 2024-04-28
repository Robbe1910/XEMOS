import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Esp32Component } from './esp32.component';

describe('Esp32Component', () => {
  let component: Esp32Component;
  let fixture: ComponentFixture<Esp32Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Esp32Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Esp32Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
