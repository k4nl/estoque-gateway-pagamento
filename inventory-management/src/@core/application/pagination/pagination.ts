import { PaginationProps } from './pagination.props';

type PaginationResponse = {
  page: number;
  limit: number;
  total: number;
  nextPage: number | null;
  previousPage: number | null;
};

export class Pagination {
  private metadata: PaginationResponse = {
    page: 1,
    limit: 10,
    total: 0,
    nextPage: null,
    previousPage: null,
  };

  constructor(props: PaginationProps) {
    this.metadata.page = props.page || 1;
    this.metadata.limit = props.limit || 10;
    this.metadata.total = 0;
    this.metadata.nextPage = null;
    this.metadata.previousPage = null;
  }

  private setNextPage(): void {
    if (this.metadata.total <= this.metadata.limit) {
      this.metadata.nextPage = null;
      return;
    }

    this.metadata.nextPage = this.metadata.page + 1;
  }

  private setPreviousPage(): void {
    if (this.metadata.page <= 1) {
      this.metadata.previousPage = null;
      return;
    }

    this.metadata.previousPage = this.metadata.page - 1;
  }

  public setMetadata(total: number): void {
    this.metadata.total = total;
    this.setNextPage();
    this.setPreviousPage();
  }

  public getPage(): number {
    return this.metadata.page;
  }

  public getLimit(): number {
    return this.metadata.limit;
  }

  public getOffset(): number {
    return (this.metadata.page - 1) * this.metadata.limit;
  }
}
