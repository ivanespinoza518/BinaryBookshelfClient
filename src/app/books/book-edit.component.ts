import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Book } from './book';
import { Author } from '../authors/author';
import { Category } from '../categories/category';
import { BookService } from './book.service';
import { BaseFormComponent } from '../base-form.component';

@Component({
  selector: 'app-book-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    RouterLink
  ],
  templateUrl: './book-edit.component.html',
  styleUrl: './book-edit.component.scss'
})
export class BookEditComponent extends BaseFormComponent implements OnInit {
  // the view title
  viewTitle?: string;

  // the book object to edit or create
  book?: Book;

  // the book object id, as fetched from the active route:
  // It's NULL when we're adding a new book,
  // and not NULL when we're editing an existing one.
  id?: number;

  // the authors array for the select
  authors?: Author[];

  // the categories array for the select
  categories?: Category[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private bookService: BookService) {
    super();
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      subtitle: new FormControl(''),
      description: new FormControl('', Validators.required),
      edition: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/)
      ]),
      isbn13: new FormControl('', [
        Validators.required,
        Validators.pattern(/^97[89][-][0-9]{10}$/)
      ]),
      imageUrl: new FormControl('', Validators.required),
      price: new FormControl('', [
        Validators.required,
        Validators.pattern(/^([0-9]+(\.[0-9]{1,2})?)|(\.[0-9]{1,2})$/)
      ]),
      authorId: new FormControl('', Validators.required),
      categoryId: new FormControl('', Validators.required)
    }, null, this.isDupeBook());

    this.loadData();
  }

  loadData() {
    // load authors
    this.loadResources<Author>("Authors", "name");

    // load categories
    this.loadResources<Category>("Categories", "label");

    // retrieve the ID from the 'id' parameter
    var idParam = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;

    if (this.id) { // EDIT MODE
      // fetch the book from the server
      this.bookService.get(this.id).subscribe({
        next: (result) => {
          this.book = result;
          this.viewTitle = "Edit - " + this.book.title;

          // update the form with the book value
          this.form.patchValue(this.book);
        },
        error: (error) => console.error(error)
      });
    }
    else { // ADD NEW MODE
      this.viewTitle = "Create a new Book";
    }
  }

  loadResources<T>(resource: string, sortColumn: string) {
    this.bookService.getResources<T>(
      resource,
      0,
      9999,
      sortColumn,
      "asc",
      null,
      null).subscribe({
      next: (result) => {
        if (resource === 'Authors') {
          this.authors = result.data as Author[];
        }
        else if (resource === 'Categories') {
          this.categories = result.data as Category[];
        }
      },
      error: (error) => console.error(error)
    });
  }

  onSubmit() {
    var book = (this.id) ? this.book : <Book>{};
    if (book) { // EDIT MODE
      book.title = this.form.controls['title'].value;
      book.subtitle = this.form.controls['subtitle'].value;
      book.description = this.form.controls['description'].value;
      book.edition = +this.form.controls['edition'].value;
      book.imageUrl = this.form.controls['imageUrl'].value;
      book.price = +this.form.controls['price'].value;
      book.authorId = +this.form.controls['authorId'].value;
      book.categoryId = +this.form.controls['categoryId'].value;

      if (this.id) {
        this.bookService
          .put(book)
          .subscribe({
            next: (result) => {
              console.log(`Book ${book!.id} has been updated.`);

              // go back to books view
              this.router.navigate(['/books']);
            },
            error: (error) => console.error(error)
          });
      }
      else { // ADD NEW MODE
        this.bookService
          .post(book)
          .subscribe({
            next: (result) => {
              console.log(`Book ${result.id} has been created.`);

              this.router.navigate(['/books']);
            },
            error: (error) => console.error(error)
          });
      }
    }
  }

  isDupeBook(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      let book = <Book>{};
      book.id = (this.id) ? this.id : 0;
      book.title = this.form.controls['title'].value;
      book.subtitle = this.form.controls['subtitle']?.value;
      book.description = this.form.controls['description'].value;
      book.edition = +this.form.controls['edition'].value;
      book.isbn13 = this.form.controls['isbn13'].value;
      book.imageUrl = this.form.controls['imageUrl'].value;
      book.price = +this.form.controls['price'].value;
      book.authorId = +this.form.controls['authorId'].value;
      book.categoryId = +this.form.controls['categoryId'].value;

      return this.bookService.isDupeBook(book)
        .pipe(map(result => {
          return (result ? { isDupeBook: true }: null);
        }));
    }
  }
}