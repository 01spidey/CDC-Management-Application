import { Injectable } from '@angular/core';
import { user } from '../models/model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  user_role = "null"
  user_id = "null"

  cur_user_data:user = {
    user_id: '',
    name : '',
    mail : '',
    phone : '',
    staff_id : ''
  }

  constructor() { }
}


