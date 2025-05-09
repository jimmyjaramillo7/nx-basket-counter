import { Injectable, computed, signal } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subscription, tap } from 'rxjs';
import { IColors } from '../interfaces/board-colors.interface';
import { environment } from '../../../environments/environment.development';
import * as parser from "socket.io-msgpack-parser";


@Injectable()
export class Boar extends Socket {

  constructor() {
    console.log("INICIANDO SOCKET TABLERO");
    super({
      url: environment.socketURL, options: {
        parser,
      }
    });
    this.subToMainData();
    //this.loadInitData();
  }
  /* PAUSE */
  isPaused = signal<boolean>(true);
  /* PERIODO */
  period = signal<string>('1');
  /* CONTADOR PRINCIPAL */
  timer = signal<string>("00:00");
  /* PUNTUACIONES */
  homeTeamName = signal<string>("CASA");
  homeTeam = signal<number>(0);
  guestTeamName = signal<string>("VISITANTE");
  guestTeam = signal<number>(0);
  /* LOGOS */
  logoHome = signal<string>('');
  logoGuest = signal<string>('');
  /* FALTAS */
  faultsHome = signal<number>(0);
  faultsGuest = signal<number>(0);
  /* SUSCRIPCIONES */
  subs: Subscription[] = [];
  /* BONUS POR FALTAS */
  bonusGuest = computed(()=>{
    return this.faultsHome() >= 4;
  })
  bonusHome = computed(()=>{
    return this.faultsGuest() >= 4;
  })
  /* COLORES */
  colors = signal<IColors>({
    background: {
      primary: "#2A52C4",
      secondary: "#3e7aff"
    },
    header: "#004170",
    footer: "#004170",
    text: "#00FF00"
  })

  backgroundGradient = computed(() => {
    //return `linear-gradient(342deg, #fff 50%, #000 50%)`
    return `linear-gradient(342deg, ${this.colors().background.primary} 50%, ${this.colors().background.secondary} 50%)`;
  })

  sponsorsLogos = signal<{
    path: string,
    hexColor: string
  }[]>([])

  auxList = signal<string[]>([]);

  listen(event: string): Observable<any> {
    return this.fromEvent(event);
  }

  subToMainData() {
    /* ESTADO DEL JUEGO (PAUSE) */
    this.subs.push(this.listen('statusGame').subscribe(x => this.isPaused.set(x)))
    /* TIEMPOS */
    this.subs.push(this.listen('timer')
    .subscribe(x => this.timer.set(x)))
    /* PERIODO */
    this.subs.push(this.listen('period').subscribe(x => this.period.set(x)))
    /* PUNTUACIÓN */
    this.subs.push(this.listen('team1').subscribe(x => this.homeTeam.set(x)))
    this.subs.push(this.listen('team2').subscribe(x => this.guestTeam.set(x)))
    /* FALTAS */
    this.subs.push(this.listen('faultHome').subscribe(x => this.faultsHome.set(x)))
    this.subs.push(this.listen('faultGuest').subscribe(x => this.faultsGuest.set(x)))
    /* LOGOS */
    this.subs.push(this.listen('logoHome').subscribe(x => this.logoHome.set(x)))
    this.subs.push(this.listen('logoGuest').subscribe(x => this.logoGuest.set(x)))
    /* NOMBRE EQUIPOS */
    this.subs.push(this.listen('nameHome').subscribe(x => this.homeTeamName.set(x)))
    this.subs.push(this.listen('nameGuest').subscribe(x => this.guestTeamName.set(x)))
    //SPONSORS LOGOS
    this.subs.push(this.listen('sponsorsLogos').subscribe(x => this.sponsorsLogos.set(x)))
    //CAM
    //this.subs.push(this.listen('cam-path').subscribe(x => this.cam1path.set(x)))
  }

  /* EMITIR */
  playPause() {
    this.emit('togglePlayPause');
  }

  emitPoint(team: string, points: number) {
    this.emit(`addPoint${team}`, points);
  }

  emitFault(team: string, num: number) {
    this.emit(`addFault${team}`, num);
  }

  emitPeriod(period: string) {
    this.emit('configPeriod', period)
  }


  /* rotateIndex() {
    this.timeoutRotation = setInterval(() => {
      let aux = this.indexSponsor() + 1;
      if (aux >= this.sponsorsLogos().length) {
        aux = 0;
      }
      this.indexSponsor.set(aux);
    }, 1000 * 10);
  } */

}