import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

import { Book } from '../books/book';
import { AuthService } from '../auth/auth.service';
import { AuthorService } from './author.service';

@Component({
  selector: 'app-books-by-author',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginator,
    MatSortModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    RouterLink,
    CurrencyPipe
  ],
  templateUrl: './books-by-author.component.html',
  styleUrl: './books-by-author.component.scss'
})
export class BooksByAuthorComponent implements OnInit {
  public id: number;
  public displayedColumns: string[] = [ 'id', 'title', 'authorName', 'categoryLabel', 'price', 'isbn13' ];
  public books!: MatTableDataSource<Book>;

  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "title";
  public defaultSortOrder: "asc" | "desc" = "asc";

  defaultFilterColumn: string = "title";
  filterQuery?: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filterTextChanged: Subject<string> = new Subject<string>();

  constructor(
    protected authService: AuthService,
    private authorService: AuthorService,
    private activatedRoute: ActivatedRoute) {
    this.id = -1;
  }

  ngOnInit() {
    this.loadData();
  }

  onFilterTextChanged(filterText: string) {
    if (!this.filterTextChanged.observed) {
      this.filterTextChanged
        .pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe(query => {
          this.loadData(query);
        });
    }
    this.filterTextChanged.next(filterText);
  }

  loadData(query?: string) {
    let pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    this.filterQuery = query;
    this.getData(pageEvent);
  }

  getData(event: PageEvent) {
    const idParam = this.activatedRoute.snapshot.paramMap.get("id");
    this.id = idParam ? +idParam : -1;

    const sortColumn = (this.sort)
      ? this.sort.active
      : this.defaultFilterColumn;

    const sortOrder = (this.sort)
      ? this.sort.direction
      : this.defaultSortOrder;

    const filterColumn = (this.filterQuery)
      ? this.defaultFilterColumn
      : null;

    const filterQuery = (this.filterQuery)
      ? this.filterQuery
      : null;

    this.authorService.getBooksByAuthor(
      this.id,
      event.pageIndex,
      event.pageSize,
      sortColumn,
      sortOrder,
      filterColumn,
      filterQuery)
      .subscribe({
        next: (result) => {
          this.paginator.length = result.totalCount;
          this.paginator.pageIndex = result.pageIndex;
          this.paginator.pageSize = result.pageSize;
          this.books = new MatTableDataSource<Book>(result.data);
        },
        error: (error) => console.error(error)
      });
  }
}
