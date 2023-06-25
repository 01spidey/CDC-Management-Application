import { CanActivateFn } from '@angular/router';

export const homeGuard: CanActivateFn = (route, state) => {
  
  console.log('home guard')
  if(sessionStorage.getItem('cur_user_data') == null && sessionStorage.getItem('user_id')==null) return true;
  else return false;
};
