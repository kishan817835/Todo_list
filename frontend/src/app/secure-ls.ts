import { Injectable } from '@angular/core';
import SecureLS from 'secure-ls';

@Injectable({
  providedIn: 'root',
})
export class SecureLs {

  private ls: SecureLS;

  constructor() {
    this.ls = new SecureLS({
      encodingType: 'aes'
    });
  }

  set(key: string, value: any): void {
    this.ls.set(key, value);
  }

  get(key: string): any {
    return this.ls.get(key);
  }

  remove(key: string): void {
    this.ls.remove(key);
  }

  clear(): void {
    this.ls.clear();
  }
}
