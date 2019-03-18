import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentDataViewerComponent } from './current-data-viewer.component';

describe('CurrentDataViewerComponent', () => {
  let component: CurrentDataViewerComponent;
  let fixture: ComponentFixture<CurrentDataViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentDataViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentDataViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
