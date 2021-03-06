import User from "../../Users/users/userTypes/user";

export class Pagninator {

 private _curentPageNumber: number;
 private _numberOfPages: number;
 private _pages: number [] = [];


  constructor(curentPageNumber: number) {
    this._curentPageNumber = curentPageNumber;
  }


  get curentPageNumber(): number {
    return this._curentPageNumber;
  }

  get numberOfPages(): number {
    return this._numberOfPages;
  }

  get pages(): number[] {
    return this._pages;
  }

  public paginateRecords(recordsToPaginate: any[], numberOfRecordsForPage: number): any[] {
    let recordsForCurrentPage: any[];
    if(recordsToPaginate&&recordsToPaginate.length>0) {
      this._numberOfPages = this.getNumberOfPages(numberOfRecordsForPage, recordsToPaginate);
      this.populatePageArrayForGivenNumberOfPages(this._pages, this._numberOfPages);
      console.log(`this.pages.lenght= ${this._pages.length}`);
      console.log(`numberOfPages=${this._numberOfPages}`);
      console.log(`currentpageNumber = ${this._curentPageNumber}`);
     recordsForCurrentPage = this.getRecordsForCurrentPage(recordsToPaginate, this._curentPageNumber, numberOfRecordsForPage);
    }
    return recordsForCurrentPage;

  }



  private getNumberOfPages(numberOfRecordsForPage: number, records:any []): number {
    const numberOfPages= Math.ceil((records.length/numberOfRecordsForPage));
    console.log(`numberOfPages = ${numberOfPages}`);
    return numberOfPages;
  }
  private populatePageArrayForGivenNumberOfPages(array: any[], pageNumber: number) {
    array.length =0;
    for (let i = 1; i<=pageNumber; i++) {
      array.push(i);
    }
  }
  private getRecordsForCurrentPage(allRecords: any[], pageNumber: number, numberOfRecordsForPage: number): any[] {
    const recordForThisPage = [];

    for (let i = 0; i <allRecords.length ; i++) {

      if(pageNumber ===1) {
        if(i+1<=numberOfRecordsForPage*(pageNumber)) {
          recordForThisPage.push(allRecords[i]);
        }
      }
      else if(pageNumber >1) {
        if(i+1<=numberOfRecordsForPage*(pageNumber) && i+1 >numberOfRecordsForPage*(pageNumber-1)){
          recordForThisPage.push(allRecords[i]);
        }
      }


    }


    return recordForThisPage;

  }


}
