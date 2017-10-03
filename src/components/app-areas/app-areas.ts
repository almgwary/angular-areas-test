import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import * as $ from 'jquery';

//This will inject a jQuery variable to your imported module
import  "imports-loader?jQuery=jquery!../../assets/scripts/jquery.selectareas.js"

/**
 * Generated class for the AppAreasComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-areas',
  templateUrl: 'app-areas.html'
})
export class AppAreasComponent implements AfterViewInit{

  @ViewChild('imageElement')imageElement:ElementRef ;
  // real image width and height, this value set after onImageLoaded
  imageNaturalWidth:number = 500 ;
  imageNaturalHeight:number = 0 ;
  // rendered width and height, this value set after onImageLoaded
  imageViewedWidth:number = 0 ;
  imageViewedHeight:number = 0 ;

  constructor() {
    console.log('Hello AppAreasComponent Component');
  }

  ngAfterViewInit(){
  }


  onImageLoaded($event){
    console.log('onImageLoaded');
    // set  real image width and height
    this.imageNaturalWidth = this.imageElement.nativeElement.naturalWidth;
    this.imageNaturalHeight = this.imageElement.nativeElement.naturalHeight ;
    // set  rendered width and height
    this.imageViewedWidth = this.imageElement.nativeElement.width ;
    this.imageViewedHeight = this.imageElement.nativeElement.height ;


    console.log({imageNaturalWidth:this.imageNaturalWidth,imageNaturalHeight:this.imageNaturalHeight});
    console.log({imageViewedWidth: this.imageViewedWidth, imageViewedHeight: this.imageViewedHeight});
    // init select areas
    this.initSelectAreas();


  }


  initSelectAreas() {
    // set options
    let options:any = {
      minSize: [1, 1],    // Minimum size of a selection
      maxSize: [400, 300],  // Maximum size of a selection
      onChanging: $.noop ,   // fired during the modification of a selection
      onChanged: this.debugQtyAreas,
      areas: [
        {
          x: 60,
          y: 60,
          width: 60,
          height: 60,
        }
      ]
    };

    // set imageNaturalWidth if exist
    if(this.imageNaturalWidth > 0 ){
      options.width =this.imageNaturalWidth;
    }

    // init select areas
    $(this.imageElement.nativeElement).selectAreas(options);
    console.log('selectAreas init finished');
  }






  onBtnViewClick() {
    let areas = $(this.imageElement.nativeElement).selectAreas('areas');
    this.displayAreas(areas);
  }
  onBtnViewRelativeClick() {
    let areas = $(this.imageElement.nativeElement).selectAreas('relativeAreas');
    this.displayAreas(areas);
  }
  onBtnResetClick () {
    this.output("reset")
    $(this.imageElement.nativeElement).selectAreas('reset');
  }
  onBtnDestroyClick () {
    $(this.imageElement.nativeElement).selectAreas('destroy');

    this.output("destroyed")
    $('.actionOn').attr("disabled", "disabled");
    $('.actionOff').removeAttr("disabled")
  }
  onBtnCreateClick() {
    $(this.imageElement.nativeElement).selectAreas({
      minSize: [10, 10],
      onChanged : this.debugQtyAreas,
      width: 500,
    });

    this.output("created")
    $('.actionOff').attr("disabled", "disabled");
    $('.actionOn').removeAttr("disabled")
  }
  onBtnNewClick() {
      let areaOptions = {
        x: Math.floor((Math.random() * 200)),
        y: Math.floor((Math.random() * 200)),
        width: Math.floor((Math.random() * 100)) + 50,
        height: Math.floor((Math.random() * 100)) + 20,
      };
      this.output("Add a new area: " + this.areaToString(areaOptions))
      $(this.imageElement.nativeElement).selectAreas('add', areaOptions);
    }
  onBtnNewsClick() {
      let areaOption1 = {
        x: Math.floor((Math.random() * 200)),
        y: Math.floor((Math.random() * 200)),
        width: Math.floor((Math.random() * 100)) + 50,
        height: Math.floor((Math.random() * 100)) + 20,
      }, areaOption2 = {
        x: areaOption1.x + areaOption1.width + 10,
        y: areaOption1.y + areaOption1.height - 20,
        width: 50,
        height: 20,
      };
      this.output("Add a new area: " + this.areaToString(areaOption1) + " and " + this.areaToString(areaOption2))
      $(this.imageElement.nativeElement).selectAreas('add', [areaOption1, areaOption2]);
    }

  areaToString(area){
      return (typeof area.id === "undefined" ? "" : (area.id + ": ")) + area.x + ':' + area.y  + ' ' + area.width + 'x' + area.height + '<br />'
    }

  output(text){
      $('#output').html(text);
  }

  // Log the quantity of selections
  debugQtyAreas(event,id, areas) {
    console.log(areas.length + " areas", arguments);
  };

  // Display areas coordinates in a div
  displayAreas(areas){
    let text = "";
    $.each(areas,  (id, area) => {
      text += this.areaToString(area);
    });
    this.output(text);
  };




}


interface Area {
  x:number ;
  y:number ;
  width:number ;
  height:number ;
}
