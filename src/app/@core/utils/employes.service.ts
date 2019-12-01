import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../interfaces/employe';
import { map } from 'rxjs/operators';
import { ITimeSheet } from '../interfaces/itime-sheet';
import ThymeConstants from './thyme-constants';

@Injectable({
  providedIn: 'root'
})
export class EmployesService {

  employeesUrl: string = ThymeConstants.HOST+'/employees/get';
  employeeUrl: string = ThymeConstants.HOST+'/employees/get_shifts?emp_ids=1&types=h;t;s';
  updateEmployeeUrl :string = ThymeConstants.HOST + '/employees/update';
  constructor(private http: HttpClient) { }

  public getEmployes(): Observable<Employee[]> {
    return this.http.get(this.employeesUrl).pipe(map(res => this.mapEmployesFromApi(res)));
  }

  public getEmployee(id: String): Observable<Employee> {
    let url: string = this.employeeUrl;
    return this.http.get(url).pipe(map(res => this.mapEmployeeFromApi(res)));
  }

  public updateEmployee(employee : Employee) : Observable<any>{
    let fullSaveUrl = this.updateEmployeeUrl+"?id="+employee.id;
    if(employee.name != null){
      fullSaveUrl+="&name="+employee.name;
    }
    if(employee.password != null){
      fullSaveUrl+="&password="+employee.password;
    }
    return this.http.post(fullSaveUrl, { })
      .pipe(map(res => res));
  }
  private getThymeApiHeaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('thyme_api_token', 'sdfiu5jcnax978kel87wiqu243s');
    console.log('headers' + headers)
    return headers;
  }


  private mapEmployesFromApi(response: any): Employee[] {
    const employees: Employee[] = [];
    for (let i = 0; i < response.length; i++) {
      let employee: Employee = this.populateEmployeInformations(response[i]);
      employees.push(employee);
    }
    return employees;
  }

  private mapEmployeeFromApi(response: any): Employee {
    let responseEmployee = response.employees[0];
    let responseTimeSheets : any[] = response.timesheets;
    let employee = this.populateEmployeInformations(responseEmployee);
    let timeSheets : ITimeSheet[] = [];
    for (let i = 0; i < responseTimeSheets.length; i++) {
      let timeSheet: ITimeSheet = this.populateTimeSheetInformations(responseTimeSheets[i]);
      timeSheets.push(timeSheet);
    }
    employee.timeSheets = timeSheets;
    return employee;
  }

  private populateEmployeInformations(responseItem: any): Employee {
    let employee: Employee = <Employee>{};
    employee.id = responseItem.id;
    employee.name = responseItem.name;
    employee.password = responseItem.password;
    employee.gross_salary_month = responseItem.gross_salary_month;
    employee.contract_hours_month = responseItem.contract_hours_month;
    employee.password = responseItem.password;
    return employee;
  }

  
  private populateTimeSheetInformations(responseItem: any): ITimeSheet {
    let timeSheet: ITimeSheet = <ITimeSheet>{};
    timeSheet.from_time = responseItem.from_time;
    timeSheet.to_time = responseItem.to_time;
    timeSheet.hours = responseItem.hours;
    timeSheet.type = responseItem.type;
    timeSheet.deductedHours = responseItem.deductedHours;
    timeSheet.note = responseItem.note;
    return timeSheet;
  }

}
 