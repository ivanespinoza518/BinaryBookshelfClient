import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { of } from 'rxjs';

import { BooksComponent } from './books.component';
import { Book } from './book';
import { BookService } from './book.service';
import { ApiResult } from '../base.service';

describe('BooksComponent', () => {
  let component: BooksComponent;
  let fixture: ComponentFixture<BooksComponent>;

  beforeEach(async () => {
    // Create a mock bookService object with a mock 'getData' method
    let bookService = jasmine.createSpyObj<BookService>('BookService', ['getData']);

    // Configure the 'getData' spy method
    bookService.getData.and.returnValue(
      // return an Observable with some test data
      of<ApiResult<Book>>(<ApiResult<Book>>{
        data: [
          <Book>{
            title: 'TestBook1', subtitle: "Subtitle1",
            description: "Description1", imageUrl: "imageURL1",
            id: 1, edition: 1, price: 1.11,
            isbn13: "978-1111111111",
            authorId: 1, authorName: 'TestAuthor1',
            categoryId: 1, categoryLabel: 'TestCategory1'
          },
          <Book>{
            title: 'TestBook2', subtitle: "TestSubtitle2",
            description: "TestDescription2", imageUrl: "TestImageURL2",
            id: 2, edition: 2, price: 2.22,
            isbn13: "978-2222222222",
            authorId: 2, authorName: 'TestAuthor2',
            categoryId: 2, categoryLabel: 'TestCategory2'
          },
          <Book>{
            title: 'TestBook3', subtitle: "Subtitle3",
            description: "Description3", imageUrl: "imageURL3",
            id: 3, edition: 3, price: 3.33,
            isbn13: "978-3333333333",
            authorId: 3, authorName: 'TestAuthor3',
            categoryId: 1, categoryLabel: 'TestCategory1'
          }
        ],
        totalCount: 3,
        pageIndex: 0,
        pageSize: 10
      })
    ); 

    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        BooksComponent,
        HttpClientTestingModule,
        MatTableModule,
        MatPaginatorModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksComponent);
    component = fixture.componentInstance;

    component.paginator = jasmine.createSpyObj(
      "MatPaginator", ["length", "pageIndex", "pageSize"]
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a "Books" title', () => {
    let title = fixture.nativeElement
      .querySelector('h1');
    expect(title.textContent).toEqual('Books');
  });

  // it('should contain a table with a list of one or more books', () => {
  //   let table = fixture.nativeElement
  //     .querySelector('table.mat-mdc-table');
  //   let tableRows = table
  //     .querySelectorAll('tr.mat-mdc-row');
  //   expect(tableRows.length).toBeGreaterThan(0);
  // });
});
