import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Boar } from '../../../common/services/board-socket.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-main-counter',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './mainCounter.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainCounterComponent implements OnInit, OnDestroy{
  socketService = inject(Boar)
  destroy = inject(DestroyRef)
  indexSponsor = signal(0)
  intervalIndex: any;
  /* SONIDO DE CHICHARRA */
  audio: HTMLAudioElement = new Audio('audio/Buzzer.mp3')

  ngOnInit(): void {
    this.socketService.listen('playSound')
    .pipe(takeUntilDestroyed(this.destroy))
    .subscribe({
      next: () => {
        this.audio.play();
        if (this.socketService.period() == '4' && this.socketService.timer() == '00:00') {
          clearInterval(this.intervalIndex)
          //console.log(this.socketService.timer())
          this.indexSponsor.set(0)
          return;
        }
      }
    })

    this.intervalIndex = setInterval(() => {
      let aux = this.indexSponsor() + 1;
      
      if (aux >= this.socketService.sponsorsLogos().length) {
        aux = 0;
      }
      this.indexSponsor.set(aux);
      //console.log("CAMBIO")
    }, 1000 * 7);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalIndex)
  }
}
