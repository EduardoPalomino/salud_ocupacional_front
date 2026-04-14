import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPerfilComponent } from './menu-perfil.component';

describe('MenuPerfilComponent', () => {
  let component: MenuPerfilComponent;
  let fixture: ComponentFixture<MenuPerfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuPerfilComponent]
    });
    fixture = TestBed.createComponent(MenuPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
