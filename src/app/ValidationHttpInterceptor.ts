import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable()
export class ValidationHttpInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                /*if (event instanceof HttpResponse) {
                    console.log('Response:', event.body);
                }*/

                return event;
            }));
    }
}
