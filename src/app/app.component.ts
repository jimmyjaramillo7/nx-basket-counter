import { Component, computed, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './common/services/auth.service';
import { AuthStatus } from './common/interfaces/authStatus.enum';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'nx-basket-counter';

  private authService = inject(AuthService);
  private router = inject(Router);

  links = ['general', 'video','vistas'];
  activeLink = this.links[0];

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
        //this.router.navigateByUrl('login');
        break;
    }
    console.log('AuthStatus', this.authService.authStatus());
  })
}
