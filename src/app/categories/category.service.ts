import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Category } from './category';
import { BaseService, ApiResult } from '../base.service';
import { Book } from '../books/book';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService<Category> {
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
  ): Observable<ApiResult<Category>> {
    const url = this.getUrl("Categories");
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

    return this.http.get<ApiResult<Category>>(url, { params });
  }

  getBooksOfCategory(
    id: number,
    pageIndex: number, 
    pageSize: number, 
    sortColumn: string, 
    sortOrder: string, 
    filterColumn: string | null, 
    filterQuery: string | null
  ): Observable<ApiResult<Book>> {
    const url = this.getUrl(`Categories/BooksOfCategory/${id}`);
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

  override get(id: number): Observable<Category> {
    const url = this.getUrl(`Categories/${id}`);
    return this.http.get<Category>(url);
  }

  override put(item: Category): Observable<Category> {
    const url = this.getUrl(`Categories/${item.id}`);
    return this.http.put<Category>(url, item);
  }

  override post(item: Category): Observable<Category> {
    const url = this.getUrl("Categories");
    return this.http.post<Category>(url, item);
  }

  isDupeField(
    categoryId: number,
    fieldName: string,
    fieldValue: string
  ): Observable<boolean> {
      const params = new HttpParams()
        .set("categoryId", categoryId)
        .set("fieldName", fieldName)
        .set("fieldValue", fieldValue);

      const url = this.getUrl(`Categories/IsDupeField`);
      return this.http.post<boolean>(url, null, { params });
  }
}
