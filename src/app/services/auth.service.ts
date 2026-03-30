import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getCurrentUser(): any {
    return null;
  }

  isAuthenticated(): boolean {
    return false;
  }
}
