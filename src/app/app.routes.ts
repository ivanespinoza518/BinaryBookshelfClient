import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BooksComponent } from './books/books.component';
import { BookEditComponent } from './books/book-edit.component';
import { AuthorsComponent } from './authors/authors.component';
import { AuthorEditComponent } from './authors/author-edit.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryEditComponent } from './categories/category-edit.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch : 'full' },
    { path: 'books', component: BooksComponent },
    { path: 'book/:id', component: BookEditComponent },
    { path: 'book', component: BookEditComponent },
    { path: 'authors', component: AuthorsComponent },
    { path: 'author/:id', component: AuthorEditComponent },
    { path: 'author', component: AuthorEditComponent },
    { path: 'categories', component: CategoriesComponent },
    { path: 'category/:id', component: CategoryEditComponent },
    { path: 'category', component: CategoryEditComponent }
];
