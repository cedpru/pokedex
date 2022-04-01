import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pokemons } from './pokemons';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../modal.component';
import * as fa from '@fortawesome/free-solid-svg-icons';

interface ApiData {
  count: number;
  next: string;
  previous: number;
  results: Pokemons[];
}

@Component({
  selector: 'app-pokemons',
  templateUrl: './pokemons.component.html',
  styleUrls: ['./pokemons.component.css']
})
export class PokemonsComponent implements OnInit {
  @Input()
  urlPokemon!: string;

  faPrev = fa.faChevronLeft;
  faNext = fa.faChevronRight;


  pokemonsUrl = 'https://pokeapi.co/api/v2/pokemon/';
  pokemons?: Pokemons;
  apiData!: Observable<ApiData>;

  constructor(
    private http: HttpClient,
    private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getPokemons(this.pokemonsUrl);
  }

  getPokemons(url: any) {
    this.apiData = this.http.get<any>(url).pipe(
			map(
        response =>
          ({
          count: response.count,
          next: response.next,
          previous: response.previous,
          results: response.results
        } as ApiData)
      )
    );
  }

  onClickPokemon(urlPokemon: String) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.url = urlPokemon;
  }
}
