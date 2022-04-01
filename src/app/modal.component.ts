import { Component, EventEmitter, Input, Output } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { HttpClient } from '@angular/common/http';
import { map, mergeMap, Observable } from "rxjs";
import { Evolution, Pokemon } from "./pokemons/pokemons";
import * as fa from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'modal-pokemon',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class NgbdModalContent {
  @Input() url: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  faEvolution = fa.faChartLine

  pokemonData!: Observable<Pokemon>;
  evolutionData!: Observable<Evolution>;
  allData!: any;

  constructor(
    private http: HttpClient,
    public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.getData(this.url);
  }

  getData(url: string) {
    this.getPokemonDetail(url)
      .pipe(
        mergeMap(outer => {
          return this.getEvolution((<any>outer).species.url).pipe(
            map(val => {
              return {
                ...outer,
                evolution: val
              };
            })
          );
        })
      )
      .subscribe(val => {
        this.allData = val;
      });
  }

  getPokemonDetail(url: string) {
    return this.http.get<any>(url).pipe(
			map(
        response => ({
          abilities: response.abilities,
          name: response.name,
          forms: response.forms,
          species: response.species,
          types: response.types,
          sprites: response.sprites,
          id: response.id
        } as Pokemon)
      )
    );
  }

  getEvolution(url_species: string) {
    return this.http.get<any>(url_species)
      .pipe(
        mergeMap(outer => {
          return this.http.get<any>((<any>outer).evolution_chain.url).pipe(
            map(val => {
              // console.log(val);
              let evolution: any = val.chain;
              while (evolution.evolves_to[0]) {
                if (outer.name == evolution.species.name) {
                  return evolution.evolves_to[0].species;
                }
                evolution = evolution.evolves_to[0];
              }
              return;
            })
          );
        })
    )
  }

  reloadData(name: string) {
    this.getData(`https://pokeapi.co/api/v2/pokemon/${name}`);
  }
}
