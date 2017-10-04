import { Component,ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Area, AppAreaOptions, AppAreasComponent } from '../../components/app-areas/app-areas';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  options:AppAreaOptions ;
  imgSrc:string = "./assets/7337760.png" ;

  areas:Array<Area> = [] ;
  @ViewChild(AppAreasComponent) appAreasComponent:AppAreasComponent;

  constructor(public navCtrl: NavController,private changeDetectorRef: ChangeDetectorRef) {
    this.fetchAreas();
    this.initOptions();
  }


  initOptions(){
    this.options = {
      allowEdit:  true,
      allowMove:  true,
      allowResize:  true,
      allowSelect:  true,
      allowDelete:  true,
      minSize:  [1, 1],    // Minimum size of a selection
      maxSize:  [5000, 5000],  // Maximum size of a selection
      onAreaBlur:  this.onAreaBlur.bind(this) ,   // fired when area blured
      onAreaFocus:  this.onAreaFocus.bind(this) ,   // fired when area focused
      onChanged:  this.onAreasChanged.bind(this),
      width:  null,
      areas: this.areas
    };
  }
  fetchAreas(){
    this.areas = [
      {
        customId:"me1",
        text:" this is me1 text ",
        color:"red",
        x: 60,
        y: 60,
        width: 60,
        height: 60,
      },
      {
        customId:"me2",
        text:" this is me2 text ",
        color:"red",
        x: 180,
        y: 60,
        width: 60,
        height: 60,
      }

      ,
      {
        customId:"me3",
        text:" this is me3 text ",
        color:"red",
        x: 60,
        y: 180,
        width: 60,
        height: 60,
      }
      ,
      {
        customId:"me4",
        text:" this is me3 text ",
        color:"red",
        x: 180,
        y: 180,
        width: 60,
        height: 300,
      }
    ]
  }


  onAreaBlur(area?:Area){
    console.log('home page onAreaBlur customId:',area.customId);
    let foundArea = this.areas.find(a => a.customId == area.customId );
    if(foundArea){
      foundArea.isFocused = false ;
    }

  }
  onAreaFocus(area?:Area){

      console.log('home page onAreaFocus customId:',area.customId);
      let foundArea = this.areas.find(a => a.customId == area.customId );
      if(foundArea){
        foundArea.isFocused = true ;
      }

  }
  // Log the quantity of selections
  onAreasChanged(event,id, areas) {
    console.log('home page onAreasChanged :',areas.length + " areas", arguments);
  };

  focusAreaByCustomId(customId?:any){
    this.appAreasComponent.focusAreaByCustomId(customId);

  }
  changeAreaText(customId:any,areaData?:Area){
    this.appAreasComponent.changeAreaText(customId,areaData);
  }

  getAreasRelativeSize(){
    let newAreas = this.appAreasComponent.getAreasRelative();
    console.log("getAreasRelativeSize", newAreas ) ;
  }

}
