import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Book } from './book';
import { BaseService, ApiResult } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class BookService extends BaseService<Book> {
  constructor(http: HttpClient) {
    super(http);
  }

  override getData(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string | null,
    filterQuery: string | null
  ): Observable<ApiResult<Book>> {
    const url = this.getUrl("Books");
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

    return this.http.get<ApiResult<Book>>(url, { params });
  }

  override get(id: number): Observable<Book> {
    const url = this.getUrl(`Books/${id}`);
    return this.http.get<Book>(url);
  }

  override put(item: Book): Observable<Book> {
    const url = this.getUrl(`Books/${item.id}`);
    return this.http.put<Book>(url, item);
  }

  override post(item: Book): Observable<Book> {
    const url = this.getUrl(`Books`);
    return this.http.post<Book>(url, item);
  }

  getResources<T>(
    resource: string,
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string | null,
    filterQuery: string | null
  ): Observable<ApiResult<T>> {
    const url = this.getUrl(resource);
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

    return this.http.get<ApiResult<T>>(url, { params });
  }

  isDupeBook(item: Book): Observable<boolean> {
    const url = this.getUrl(`Books/IsDupeBook`);
    return this.http.post<boolean>(url, item);
  }
}
