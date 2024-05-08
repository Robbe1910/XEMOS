import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalUCR3DComponent } from './terminal-ucr3-d.component';

describe('TerminalUCR3DComponent', () => {
  let component: TerminalUCR3DComponent;
  let fixture: ComponentFixture<TerminalUCR3DComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminalUCR3DComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalUCR3DComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
