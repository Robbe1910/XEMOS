import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalUcr3DDeepSleepComponent } from './terminal-ucr3-d-deep-sleep.component';

describe('TerminalUcr3DDeepSleepComponent', () => {
  let component: TerminalUcr3DDeepSleepComponent;
  let fixture: ComponentFixture<TerminalUcr3DDeepSleepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminalUcr3DDeepSleepComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalUcr3DDeepSleepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
