import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BooksComponent } from './books/books.component';
import { BookEditComponent } from './books/book-edit.component';
import { AuthorsComponent } from './authors/authors.component';
import { AuthorEditComponent } from './authors/author-edit.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryEditComponent } from './categories/category-edit.component';
import { LoginComponent } from './auth/login.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch : 'full' },
    { path: 'books', component: BooksComponent },
    { path: 'book/:id', component: BookEditComponent, canActivate: [AuthGuard] },
    { path: 'book', component: BookEditComponent, canActivate: [AuthGuard] },
    { path: 'authors', component: AuthorsComponent },
    { path: 'author/:id', component: AuthorEditComponent, canActivate: [AuthGuard] },
    { path: 'author', component: AuthorEditComponent, canActivate: [AuthGuard] },
    { path: 'categories', component: CategoriesComponent },
    { path: 'category/:id', component: CategoryEditComponent, canActivate: [AuthGuard] },
    { path: 'category', component: CategoryEditComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent }
];
