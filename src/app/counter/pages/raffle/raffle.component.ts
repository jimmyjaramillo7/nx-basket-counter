import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, inject, signal } from '@angular/core';
import confetti from 'canvas-confetti';
import { MultimediaService } from '../../../common/services/multimedia.service';
import { Boar } from '../../../common/services/board-socket.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sorteo',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './raffle.component.html',
  styles: `
  .form-sorteo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.dm-serif-text-regular-italic {
    font-family: "DM Serif Text", serif;
    font-weight: 400;
    font-style: italic;
}

.loader {
    width: 60px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: #0635C9;
    box-shadow: 0 0 0 0 rgba(6, 53, 201, 0.267);
    animation: l1 1s infinite;
}

@keyframes l1 {
    100% {
        box-shadow: 0 0 0 30px #0000
    }
}

  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SorteoComponent implements OnInit {

  position = 0

  //data = signal<string[]>([]);
  ganador = signal<string>('');
  destroy = inject(DestroyRef)
  sorteoTerminal = signal(false)
  start = signal(false)
  socket = inject(Boar)
  multimedia = inject(MultimediaService)

  prices = [
    { value: 0, label: '¡Una Bicicleta!', photo: 'bicycle.png' },
    { value: 1, label: '¡Un Balón!', photo: 'basket.webp' },
    { value: 2, label: '¡Una GiftCard!', photo: 'card.webp' },
  ]

  selectedPrice = signal({
    value: 0,
    label: '¡Una Bicicleta!',
    photo: 'bicycle.png'
  });

  @ViewChildren('participant') participantList!: any;
  //@ViewChild('father') father!: any;

  ngOnInit(): void {
    
    if(!this.multimedia.participantList().length){
      this.multimedia.getParticipants()
      .subscribe()
    }

    this.socket.listen('raffle')
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe(x => {
        this.start.set(false)
        this.sorteoTerminal.set(false)
        this.startSorting()
      })

      this.socket.listen('price')
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe(x => {
        this.changePrice(x)
      })

      this.socket.emit('getPrice')
  }

  startSorting() {
    this.start.set(true)
    setTimeout(() => {
      this.raffle()
    }, 300);
  }

  launchConfetti() {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }


  async raffle() {
    const winner = this.randomInteger(1, this.participantList._results.length - 1)
    this.ganador.set(this.participantList._results[winner].nativeElement.textContent);
    console.log("El ganador es: ", winner, this.ganador());

    let secondRound = false;
    //console.log(this.participantList);
    setTimeout(() => {
      secondRound = true
      this.launchConfetti()
      setTimeout(() => {
        this.sorteoTerminal.set(true)
        const tmp = this.multimedia.participantList()[winner]
        this.multimedia.participantList.update(x =>{
          const aux = x.filter((name) => name != tmp)
          console.log(aux.length,x.length);
          //x.splice(winner, 1)
          return aux;
        })
      }, 300);
    }, 3 * 1000);

    for (let index = 1; index < this.participantList.length; index++) {

      //console.log("RUN");
      const item = this.participantList._results[index];
      if (!secondRound) {
        item.nativeElement.scrollIntoView();
        item.nativeElement.classList.add('bg-red-500');
        item.nativeElement.classList.add('rounded-xl');
        await new Promise(r => setTimeout(r, 40));
        item.nativeElement.classList.remove('bg-red-500');
      } else {
        this.participantList._results[winner].nativeElement.scrollIntoView();
        this.participantList._results[winner].nativeElement.classList.add('bg-red-500');
        this.participantList._results[winner].nativeElement.classList.add('rounded-xl');
        break;
      }
    }
  }

  randomInteger(min: number, max: number) {
    console.log("Max random", max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  changePrice(evt: number){
    this.start.set(false)
    this.sorteoTerminal.set(false)
    this.selectedPrice.set(this.prices[evt])
  }
}
