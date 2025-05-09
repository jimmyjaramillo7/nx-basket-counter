import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Boar } from '../common/services/board-socket.service';

@Component({
  selector: 'app-transmission',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './transmission.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransmissionComponent {
  socket = inject(Boar)
}
