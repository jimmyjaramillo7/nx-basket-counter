import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Boar } from '../../../common/services/board-socket.service';

@Component({
  selector: 'app-mini-counter',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './mini-counter.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniCounterComponent {
  socket = inject(Boar)
}
