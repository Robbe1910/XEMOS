import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Terminal3DprotosComponent } from './terminal3-dprotos.component';

describe('Terminal3DprotosComponent', () => {
  let component: Terminal3DprotosComponent;
  let fixture: ComponentFixture<Terminal3DprotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Terminal3DprotosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Terminal3DprotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
