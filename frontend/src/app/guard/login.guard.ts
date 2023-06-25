import { CanActivateFn, Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = new Router();
  if(sessionStorage.getItem('user_role')==null){
    // trying to access login page from home page
    router.navigate([''])
    return false;
  }

  else{
    // trying to access login page from dashboard

    if(sessionStorage.getItem('user_role')=='Director'){
      if(sessionStorage.getItem('cur_user_data')==null){
        // trying to access login page from director login
        return true;
      }
      else{
        // trying to access login page from director dashboard
        router.navigate(['director'])
        return false;
      }
    }

    else if(sessionStorage.getItem('user_role')=='Officer'){
      if(sessionStorage.getItem('cur_user_data')==null){
        // trying to access login page from officer login
        return true;
      }
      else{
        // trying to access login page from officer dashboard
        router.navigate(['officer'])
        return false;
      }
    }
    else return true;
  }
}
