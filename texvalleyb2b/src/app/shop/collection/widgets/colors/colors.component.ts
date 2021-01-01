import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../../../shared/classes/product';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss']
})
export class ColorsComponent implements OnInit {

  @Input() products: Product[] = [];
  @Input() colors: any[] = [];
  @Input() key: any[] = [];

  @Output() colorsFilter  : EventEmitter<any> = new EventEmitter<any>();
  
  public collapse: boolean = true;

  constructor() { 
  }

  ngOnInit(): void {
  }

  get filterbycolor() {
    const uniqueColors = [];
    var field = this.key;
    for(var i=0; i< this.products.length; i++){
      if (this.products[i]["attribute"]) 
      {
        for(var j=0; j < this.products[i]["attribute"].length; j++){
          if(this.products[i]["attribute"][j]["a_name"] === field) {
          const index = uniqueColors.indexOf(this.products[i]["attribute"][j]["a_value"])
          if (index === -1) 
             uniqueColors.push(this.products[i]["attribute"][j]["a_value"])
          }
        }
      }
    }
    return uniqueColors
  }

  appliedFilter(event) {

    let index = this.colors.indexOf(event.target.value);  // checked and unchecked value
    if (event.target.checked)   
        this.colors.push(event.target.value); // push in array cheked value
    else 
        this.colors.splice(index,1);  // removed in array unchecked value
    
    let colors = this.colors.length ? { color: this.colors.join(",") } : { color: null };    
    this.colorsFilter.emit(colors);
  }

  // check if the item are selected
  checked(item){
    if(this.colors && this.colors.indexOf(item) != -1){
      return true;
    }
  }

}
