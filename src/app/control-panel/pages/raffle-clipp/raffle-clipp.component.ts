import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Boar } from '../../../common/services/board-socket.service';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@Component({
  selector: 'app-raffle-clipp',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule
  ],
  templateUrl: './raffle-clipp.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RaffleClippComponent implements OnInit {

  prices = [
    {
      value: 0,
      label: 'Bicicleta'
    },
    {
      value: 1,
      label: 'Balón'
    },
    {
      value: 2,
      label: 'GiftCard'
    }
  ]

  selectedPrice = signal<number>(0);

  ngOnInit(): void {
    this.socket.on('price', (data: any) => {
      this.selectedPrice.set(data)
    })

    this.socket.emit('getPrice')
  }
  
  socket = inject(Boar)

  searchWinner(){
    this.socket.emit('raffle')
  }

  changePrice(evt: any){
    //console.log(evt);
    
    this.socket.emit('setPrice',evt)
  }
}
