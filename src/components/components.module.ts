import { NgModule } from '@angular/core';
import { AppAreasComponent } from './app-areas/app-areas';
import { CommonModule  } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
	declarations: [AppAreasComponent],
  imports: [
    CommonModule,
    FormsModule,
  ],
	exports: [AppAreasComponent]
})
export class ComponentsModule {}
