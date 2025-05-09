import {MatTabsModule} from '@angular/material/tabs';
import { ChangeDetectionStrategy, Component, computed, effect, inject, type OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthStatus } from '../common/interfaces/authStatus.enum';
import { AuthService } from '../common/services/auth.service';

@Component({
  selector: 'app-control-panel',
  standalone: true,
  imports: [
    RouterOutlet,
    MatTabsModule,
    RouterLink,
    TitleCasePipe
  ],
  templateUrl: './control-panel.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlPanelComponent {
  links = ['general', 'video','vistas'];
  activeLink = this.links[0];

  /* private authService = inject(AuthService);
  private router = inject(Router);


  public finishAuthCheck = computed<boolean>(() => {

    if (this.authService.authStatus() === AuthStatus.CHECKING) {
      return false;
    }
    return true;
  })


  public onChangeAuthStatus = effect(() => {
    switch (this.authService.authStatus()) {
      case AuthStatus.CHECKING:
        return;
      case AuthStatus.AUTHENTICATED:
        const url = localStorage.getItem("board-lastUrl");
        this.router.navigateByUrl(url ?? 'home');
        break;
      case AuthStatus.UNAUTHENTICATED:
        this.router.navigateByUrl('login');
        break;
    }
    console.log('AuthStatus', this.authService.authStatus());
  }) */

}
