import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseDataViewerComponent } from './database-data-viewer.component';

describe('DatabaseDataViewerComponent', () => {
  let component: DatabaseDataViewerComponent;
  let fixture: ComponentFixture<DatabaseDataViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseDataViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseDataViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
