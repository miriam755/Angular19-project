// import { HttpInterceptorFn } from '@angular/common/http';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const authToken = localStorage.getItem('authToken');

//   if (authToken) {
//     const authReq = req.clone({
//       headers: req.headers.set('Authorization', `Bearer ${authToken}`)
//     });
//     return next(authReq);
//   }
//   return next(req);
// };
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let authReq = req;
  if (typeof window !== 'undefined') { // בדוק אם אנחנו רצים בדפדפן
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`)
      });
    }
  }
  return next(authReq);
};