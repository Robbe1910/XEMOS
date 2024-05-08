import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Terminal3DComponent } from './terminal3D.component';

describe('Obj1Component', () => {
  let component: Terminal3DComponent;
  let fixture: ComponentFixture<Terminal3DComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Terminal3DComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Terminal3DComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
