import { Component, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

import * as $ from 'jquery';

//This will inject a jQuery variable to your imported module
import  "imports-loader?jQuery=jquery!./jquery.selectareas.js"

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
  @Input('options')options:AppAreaOptions ;
  @Input('img-src')imgSrc:string ;
  // @Output() myEvent = new EventEmitter();


  // real image width and height, this value set after onImageLoaded
  imageNaturalWidth:number = 500 ;
  imageNaturalHeight:number = 0 ;
  // rendered width and height, this value set after onImageLoaded
  imageViewedWidth:number = 0 ;
  imageViewedHeight:number = 0 ;

  isImageLoaded:boolean =  false ;


  constructor() {
  }

  ngOnInit() {
    if(!this.options) throw new Error("Attribute 'options' is required");
    else if(!this.imgSrc) throw new Error("Attribute 'img-src' is required");
    else if(this.imgSrc.length < 1) throw new Error("Attribute 'img-src' must not be empty");
  }


  ngAfterViewInit(){
  }


  onImageLoaded($event){
    console.log('onImageLoaded');

    this.isImageLoaded = true;

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

  /**
   * scale area from  original size to current view size
   * current view size = this.imageViewedHeight * this.imageViewedWidth
   * real size = this.imageNaturalHeight * this.imageNaturalWidth
   * this function doesn't edit it'st input
   * @param area : Area
   */
  scaleAreaFromRealToView(area:Area):Area{

    if(! this.isImageLoaded ){
      console.error('image should be loaded first, before calculating the scale .');
      return ;
    }
    // clone area
    let newArea = Object.assign({},area);
    // get width scale
    let widthScale =  this.imageViewedWidth / this.imageNaturalWidth ;
    // get height scale
    let heightScale =  this.imageViewedHeight / this.imageNaturalHeight ;

    // calculate scale
    newArea.height = newArea.height * heightScale ;
    newArea.width = newArea.width * widthScale ;
    newArea.y = newArea.y * heightScale ;
    newArea.x = newArea.x * widthScale ;

    return newArea  ;

  }

  onAreaBlur(area?:Area){
     console.log('onAreaBlur customId:',area.customId);
  }


  onAreaFocus(area?:Area){
    console.log('onAreaFocus customId:',area.customId);
  }

  // Log the quantity of selections
  onAreasChanged(event,id, areas) {
    console.log(areas.length + " areas", arguments);
  };




  initSelectAreas() {

    // scale each area to match the view
    let scaledAreas = this.options.areas.map((area)=>(this.scaleAreaFromRealToView(area)));

    // set options
    let options:AppAreaOptions = {
      allowEdit: this.options.allowEdit  == false ?  this.options.allowEdit  : true,
      allowMove: this.options.allowMove  == false ?  this.options.allowMove  : true,
      allowResize: this.options.allowResize  == false ?  this.options.allowResize  : true,
      allowSelect: this.options.allowSelect  == false ?  this.options.allowSelect  : true,
      allowDelete: this.options.allowDelete  == false ?  this.options.allowDelete  : true,
      minSize: this.options.minSize ||  [1, 1],    // Minimum size of a selection
      maxSize: this.options.maxSize ||  [5000, 5000],  // Maximum size of a selection
      // fired during the modification of a selection
      onChanging: (data)=>{
        this.options.onChanging? this.options.onChanging(data)  :  $.noop
        }  ,
      // fired when area blured
      onAreaBlur: (area?:Area)=>{
        this.options.onAreaBlur? this.options.onAreaBlur(area)  : this.onAreaBlur(area)
      }  ,
      // fired when area focused
      onAreaFocus: (area?:Area)=>{
        this.options.onAreaFocus? this.options.onAreaFocus(area)  : this.onAreaFocus(area)
      }  ,
      onChanged: (event,id, areas)=>{
        this.options.onChanged? this.options.onChanged(event,id, areas)  : this.onAreasChanged(event,id, areas)
      }  ,
      width: this.options.width ||  null,
      areas: scaledAreas
    };

    // set imageNaturalWidth if exist
    if(this.imageNaturalWidth > 0 ){
      options.width =this.imageNaturalWidth;
    }

    // init select areas
    $(this.imageElement.nativeElement).selectAreas(options);
    console.log('selectAreas init finished', options);
  }

  focusAreaByCustomId(customId?:any){
    $(this.imageElement.nativeElement).selectAreas('focusAreaByCustomId', customId);

  }
  changeAreaText(customId:any,areaData?:Area){
    $(this.imageElement.nativeElement).selectAreas('renderArea',customId,{text:areaData.text})

  }




  getAreas():any {
    let areas = $(this.imageElement.nativeElement).selectAreas('areas');
    return areas  ;
  }
  getAreasRelative():any {
    let areas = $(this.imageElement.nativeElement).selectAreas('relativeAreas');
    return areas  ;

  }
  reset () {
    $(this.imageElement.nativeElement).selectAreas('reset');
  }
  destroy () {
    $(this.imageElement.nativeElement).selectAreas('destroy');
  }
  onBtnCreateClick() {
    $(this.imageElement.nativeElement).selectAreas({
      minSize: [10, 10],
      onChanged : this.onAreasChanged,
      width: 500,
    });

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
      $(this.imageElement.nativeElement).selectAreas('add', [areaOption1, areaOption2]);
    }



  ngOnDestroy(){
    this.destroy()
  }





}


export interface Area {
  customId?:string;
  text?:string;
  color?:string;
  x:number ;
  y:number ;
  width:number ;
  height:number ;
  isFocused?:boolean ;
}

// set options
export interface AppAreaOptions {
  allowEdit?: boolean,
  allowMove?: boolean,
  allowResize?: boolean,
  allowSelect?: boolean,
  allowDelete?: boolean,
  width?: number, // the  view width,  used to calculate the real size
  minSize?: [number, number],    // Minimum size of a selection
  maxSize?: [number, number],  // Maximum size of a selection
  onChanging?: any ,   // fired during the modification of a selection
  onAreaBlur?: any ,   // fired when area blurred
  onAreaFocus?: any ,   // fired when area focused
  onChanged?: any,
  areas?: Area[]
}
