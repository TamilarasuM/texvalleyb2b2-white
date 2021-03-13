import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})
export class PriceComponent implements OnInit {
  
  // Using Output EventEmitter
  @Output() priceFilter : EventEmitter<any> = new EventEmitter<any>();
	
  // define min, max and range
  @Input() min: number;
  @Input() max: number;
  @Input() floorValue: number;
  @Input() ceilValue: number;

  public collapse: boolean = true;
  public isBrowser: boolean = false;

  options: Options = {
    floor: 0,
    ceil: 5000
  };
  
  price = { 
    minPrice: this.min, 
    maxPrice: this.max 
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { 
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true; // for ssr
    }
  }
  
  ngOnInit(): void { 
    this.options.ceil =  5000 ; //this.ceilValue;
    this.options.floor = 0; //this.floorValue;
   }

  // Range Changed
  appliedFilter(event: any) {
    // this.price = "price "+event.value +"-" +event.highValue"; //{ minPrice: event.value, maxPrice: event.highValue };
    this.priceFilter.emit({"size": "Price " + event.value +"-" +event.highValue});
  }

}
