import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Author } from './author';
import { AuthorService } from './author.service';
import { BaseFormComponent } from '../base-form.component';

@Component({
  selector: 'app-author-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    RouterLink
  ],
  templateUrl: './author-edit.component.html',
  styleUrl: './author-edit.component.scss'
})
export class AuthorEditComponent extends BaseFormComponent implements OnInit {
  // the view title
  title?: string;

  // the author object to edit or create
  author?: Author;

  // the author id, as fetched from the active route:
  // It's NULL when we're adding a new author,
  // and not NULL when we're editing an existing one.
  id?: number;

  // the authors array for the select
  authors?: Author[];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authorService: AuthorService) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['',
        Validators.required,
        this.isDupeField("name")
      ],
      background: ['',
        Validators.required,
        this.isDupeField("background")
      ]
    });

    this.loadData();
  }

  loadData() {
    // retrieve the ID from the 'id' parameter
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;

    if (this.id) { 
      // EDIT MODE
      // fetch the author from the server
      this.authorService.get(this.id).subscribe({
        next: (result) => {
          this.author = result;
          this.title = "Edit - " + this.author.name;

          // update the form with the author value
          this.form.patchValue(this.author);
        },
        error: (error) => console.error(error)
      });
    }
    else {
      // ADD NEW MODE
      this.title = "Create a new Author";
    }
  }

  onSubmit() {
    let author = (this.id) ? this.author : <Author>{};
    if (author) {
      author.name = this.form.controls['name'].value;
      author.background = this.form.controls['background'].value;
      
      if (this.id) {
        // EDIT MODE
        this.authorService
          .put(author)
          .subscribe({
            next: (result) => {
              console.log("Author " + author!.id + " has been updated.");

              // go back to authors view
              this.router.navigate(['/authors']);
            },
            error: (error) => console.error(error)
          });
      }
      else {
        // ADD NEW mode
        this.authorService
          .post(author)
          .subscribe({
            next: (result) => {
              console.log("Author " + result.id + " has been created.");

              // go back to authors view
              this.router.navigate(['/authors']);
            },
            error: (error) => console.error(error)
          });
      }
    }
  }

  isDupeField(fieldName: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this.authorService.isDupeField(
        this.id ?? 0,
        fieldName,
        control.value)
        .pipe(map(result => {
          return (result ? { isDupeField: true } : null);
        }));
    }
  }
}
