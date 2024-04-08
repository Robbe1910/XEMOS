import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListDevicesPage } from './list-devices.page';

describe('ListDevicesPage', () => {
  let component: ListDevicesPage;
  let fixture: ComponentFixture<ListDevicesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDevicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
