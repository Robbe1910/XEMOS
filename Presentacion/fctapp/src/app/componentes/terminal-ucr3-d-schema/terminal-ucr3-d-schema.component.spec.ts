import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalUcr3DSchemaComponent } from './terminal-ucr3-d-schema.component';

describe('TerminalUcr3DSchemaComponent', () => {
  let component: TerminalUcr3DSchemaComponent;
  let fixture: ComponentFixture<TerminalUcr3DSchemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminalUcr3DSchemaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalUcr3DSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
