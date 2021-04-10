import {Router} from '@angular/router';

export const navigateToUrlAfterTimout =  (url: string, router: Router): void => {
  setTimeout(async () => {
   await router.navigateByUrl(`/${url}`);
  }, 1000);
};
