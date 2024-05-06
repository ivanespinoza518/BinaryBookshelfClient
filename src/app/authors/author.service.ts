import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Author } from './author';
import { BaseService, ApiResult } from '../base.service';
import { Book } from '../books/book';

@Injectable({
  providedIn: 'root'
})
export class AuthorService extends BaseService<Author> {
  constructor(
    http: HttpClient) {
      super(http);
  }

  override getData(
    pageIndex: number, 
    pageSize: number, 
    sortColumn: string, 
    sortOrder: string, 
    filterColumn: string | null, 
    filterQuery: string | null
  ): Observable<ApiResult<Author>> {
    const url = this.getUrl("Authors");
    let params = new HttpParams()
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
      .set("sortColumn", sortColumn)
      .set("sortOrder", sortOrder);

    if (filterColumn && filterQuery) {
      params = params
        .set("filterColumn", filterColumn)
        .set("filterQuery", filterQuery);
    }

    return this.http.get<ApiResult<Author>>(url, { params });
  }

  getBooksByAuthor(
    id: number,
    pageIndex: number, 
    pageSize: number, 
    sortColumn: string, 
    sortOrder: string, 
    filterColumn: string | null, 
    filterQuery: string | null
  ): Observable<ApiResult<Book>> {
    const url = this.getUrl(`Authors/BooksByAuthor/${id}`);
    let params = new HttpParams()
      .set("id", id)
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
      .set("sortColumn", sortColumn)
      .set("sortOrder", sortOrder);

    if (filterColumn && filterQuery) {
      params = params
        .set("filterColumn", filterColumn)
        .set("filterQuery", filterQuery);
    }

    return this.http.get<ApiResult<Book>>(url, { params });
  }

  override get(id: number): Observable<Author> {
    const url = this.getUrl(`Authors/${id}`);
    return this.http.get<Author>(url);
  }
  override put(item: Author): Observable<Author> {
    const url = this.getUrl(`Authors/${item.id}`);
    return this.http.put<Author>(url, item);
  }
  override post(item: Author): Observable<Author> {
    const url = this.getUrl(`Authors`);
    return this.http.post<Author>(url, item);
  }

  isDupeField(
    authorId: number,
    fieldName: string,
    fieldValue: string
  ): Observable<boolean> {
      const params = new HttpParams()
        .set("authorId", authorId)
        .set("fieldName", fieldName)
        .set("fieldValue", fieldValue);

      const url = this.getUrl(`Authors/IsDupeField`);
      return this.http.post<boolean>(url, null, { params });
  }
}
