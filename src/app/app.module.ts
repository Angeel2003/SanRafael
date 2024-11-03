import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [
    IonicModule.forRoot(),
    FormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
