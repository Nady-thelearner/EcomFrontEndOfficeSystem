import { Injectable } from '@angular/core';
import * as cryptoJs from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class cryptoService {
  private secretkey = 'this is terst';

  encrypt(data: any) {
    const encryptedData = cryptoJs.AES.encrypt(
      JSON.stringify(data),
      this.secretkey
    ).toString();
    return encryptedData;
  }

  decrypt(encryptedData: any) {
    const decryptedBytes = cryptoJs.AES.decrypt(encryptedData, this.secretkey);
    const decryptedData = JSON.parse(
      decryptedBytes.toString(cryptoJs.enc.Utf8)
    );
    return decryptedData;
  }
}
