import {Injectable} from '@angular/core';
import {API_CONFIG} from '../../../core/config/api.config';
import {HttpClient} from '@angular/common/http';
import {TokenService} from '../../../core/services/token.service';
import {Observable} from 'rxjs';
import {User} from '../../../data/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private base = API_CONFIG.baseUrl;

  constructor(private http: HttpClient, private token: TokenService) {
  }


  //getall users
  getAllUsers(): Observable<any> {
    return this.http.get<User[]>(this.base + API_CONFIG.admin.list_users);
  }

  // get by id users


  // update users


}
