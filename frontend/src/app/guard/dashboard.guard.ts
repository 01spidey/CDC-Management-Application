import { CanActivateFn, Router } from '@angular/router';

export const dashboardGuard: CanActivateFn = (route, state) => {

  const router = new Router();
  console.log(route.routeConfig?.path)
  if(route.routeConfig?.path=='director'){
    if(sessionStorage.getItem('user_role')=='Director'){
      // trying to access director dashboard from director login


    }
    else if(sessionStorage.getItem('user_role')=='Officer'){
      // trying to access director dashboard from officer login

    }
    else{
      // trying to access director dashboard from home page
      console.log('trying to access director dashboard from home page')
      sessionStorage.clear()
      return false;

    }
  }
  else if(route.routeConfig?.path=='officer'){
    if(sessionStorage.getItem('user_role')=='Officer'){
      // trying to access officer dashboard from officer login
      // console.log('trying to access officer dashboard from officer login')
      if(sessionStorage.getItem('cur_user_data')==null){
        router.navigate(['login'])
        return false;
      }else return true;

    }
    else if(sessionStorage.getItem('user_role')=='Director'){
      // trying to access officer dashboard from director login
      if(sessionStorage.getItem('cur_user_data')==null){
        router.navigate(['login'])
        return false;
      }else return true;
    }
    else{
      // trying to access officer dashboard from home page
      console.log('trying to access officer dashboard from home page')
      sessionStorage.clear()
      return false;
    }
  }
  return false;
}