import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class NotificationService {
  constructor(private snackbar: MatSnackBar) {}

  notify(msg: string, action: string = 'Aceptar', duration: number = 4000) {
    this.snackbar.open(msg, action, { duration });
  }

  popup(msg: string) {
    this.snackbar.open(msg, 'Aceptar', { duration: 4000 });
  }
}
