import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { EliminarMenuComidaComponent } from './eliminar-menu-comida/eliminar-menu-comida.component'
import { TareaComedorComponent } from './tarea-comedor/tarea-comedor.component'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, EliminarMenuComidaComponent, TareaComedorComponent],
})
export class AppComponent {
  constructor() {}
}
