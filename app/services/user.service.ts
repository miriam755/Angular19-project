import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { UserLogin } from '../models/loginUser.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/auth'; // ודא שכתובת ה-API נכונה

  constructor(private http: HttpClient) {}

  register(newUser: User): Observable<any> { // שיניתי את סוג ההחזרה ל-any כדי להתאים לתגובה
    return this.http.post<any>(this.apiUrl + '/register', newUser);
  }

  login(userlog: UserLogin): Observable<any> { // שיניתי את סוג ההחזרה ל-any כדי להתאים לתגובה
    return this.http.post<any>(this.apiUrl + '/login', userlog);
  }
}