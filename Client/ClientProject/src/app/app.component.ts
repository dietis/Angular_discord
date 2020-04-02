import { Component } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None //sinon jquery en mode "global" ne peut retrouver le css car il est limité  la parti "app" seulement, jquery est en global
})
export class AppComponent {
  title = 'ClientProject';
}
