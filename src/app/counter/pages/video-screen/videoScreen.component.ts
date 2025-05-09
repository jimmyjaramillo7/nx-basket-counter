import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { Boar } from '../../../common/services/board-socket.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MiniCounterComponent } from '../../components/mini-counter/mini-counter.component';
import { TransmissionComponent } from '../../../transmission/transmission.component';

@Component({
  selector: 'app-video-screen',
  standalone: true,
  imports: [
    CommonModule,
    MiniCounterComponent,
  ],
  templateUrl: './videoScreen.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoScreenComponent implements OnInit{
  destroy = inject(DestroyRef)
  socket = inject(Boar)

  selectedVideo = signal<string>('')
  ngOnInit(): void {
   
    this.socket.listen('loadVideo')
    .pipe(takeUntilDestroyed(this.destroy))
    .subscribe({
      next: (res) => {
        this.selectedVideo.set(res)
      }
    })

    this.socket.emit('getVideo')
  }
}
