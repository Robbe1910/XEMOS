import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalUcr3DAdvancedComponent } from './terminal-ucr3-d-advanced.component';

describe('TerminalUcr3DAdvancedComponent', () => {
  let component: TerminalUcr3DAdvancedComponent;
  let fixture: ComponentFixture<TerminalUcr3DAdvancedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminalUcr3DAdvancedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalUcr3DAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
