import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksOfCategoryComponent } from './books-of-category.component';

describe('BooksOfCategoryComponent', () => {
  let component: BooksOfCategoryComponent;
  let fixture: ComponentFixture<BooksOfCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksOfCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BooksOfCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
