import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonButton, IonCol, IonIcon, IonItem, IonInput, IonLabel, IonList } from '@ionic/angular/standalone';
import { MenuItem } from '../models/menu.interface';
import { Router } from '@angular/router';
import { arrowBackOutline, personCircleOutline, addOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FirebaseService } from '../services/firebase.service';
import { MenuService } from '../services/menu.service';
import { saveOutline } from 'ionicons/icons';
import { trashOutline } from 'ionicons/icons';


@Component({
  selector: 'app-crear-menu',
  templateUrl: './crear-menu.page.html',
  styleUrls: ['./crear-menu.page.scss'],
  standalone: true,
  imports: [IonList, IonLabel, IonInput, IonItem, IonIcon, IonCol, IonButton, IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})

/*
Behavior 

retrieve menus
show all names, pictograms and images
no edit possible
just create/delete 

create:
put title
import pictogram/image files
push button save

for each menu:
removed:
  delete old images and picto (only those deleted)
    if done: delete menu

new:
  save new imported images
  retrieve urls, create menu objects to be created
  save menu objects
*/

export class CrearMenuPage implements OnInit {

  taskPreview: File | null = null;
  previewUrl: string | null = null;

  menus: MenuItem[] = [
    // Example of a menu item
    // {
    //   name: 'Vegetariano',
    //   pictogram: {
    //     url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Soy-whey-protein-diet.jpg/1024px-Soy-whey-protein-diet.jpg",
    //     path: "",
    //     file: undefined
    //   },
    //   image: {
    //     url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Soy-whey-protein-diet.jpg/1024px-Soy-whey-protein-diet.jpg",
    //     path: "",
    //     file: undefined
    //   }
    // }
  ];

  newMenus: MenuItem[] = [];
  removedMenus: MenuItem[] = [];

  addMenu() {
    this.newMenus.push(
      {
        name: '',
        pictogram: {
          url: "",
          path: "",
          file: undefined
        },
        image: {
          url: "",
          path: "",
          file: undefined
        }
      });
  }

  deleteMenu(index: number) {
    //transfer the deleted menu from menus to removedMenus
    this.removedMenus.push(this.menus.splice(index, 1)[0]);
  }


  constructor(private router: Router, private menuService: MenuService, private firebaseService: FirebaseService) {
    addIcons({
      arrowBackOutline,
      personCircleOutline,
      addOutline,
      saveOutline,
      trashOutline
    });
  }

  ngOnInit() {
    this.loadMenus();
  }

  async loadMenus() {
    try {
      this.menus = await this.menuService.getMenus();
    } catch (error) {
      console.error('Error loading menus:', error);
    }
  }


  loadFile(event: Event, newMenuIndex: number, isImage: boolean) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.newMenus[newMenuIndex][isImage ? 'image' : 'pictogram'].file = file;
      this.newMenus[newMenuIndex][isImage ? 'image' : 'pictogram'].url = URL.createObjectURL(file);
    }
  }

  async saveMenus() {

    const timestamp = new Date().getTime();

    // Loop to delete deleted menus
    for (const menu of this.removedMenus) {
      try {
        if (!menu.id) {
          console.error('Menu ID not found:', menu);
          continue;
        }
        //remove img & picto
        await this.firebaseService.deleteFile(menu.image.path);
        await this.firebaseService.deleteFile(menu.pictogram.path);

        //remove menu
        await this.menuService.removeMenu(menu.id);

      } catch (error) {
        console.error('Error deleting menu:', error);
      }


    }

    // Loop to save new menus 
    for (const [index, menu] of this.newMenus.entries()) {

      //check that the menus are correctly filled before starting saving
      if (!menu.name || !menu.image.file || !menu.pictogram.file) {
        //TODO notify user, forms are not correctly filled
        return
      }

      //save imgdeleteFile
      menu.image.path = `imagenes/menu_${timestamp}_${index}_image.png`;
      await this.firebaseService.uploadFile(menu.image.file, menu.image.path);
      menu.image.url = await this.firebaseService.getDownloadURL(menu.image.path);

      //save picto
      menu.pictogram.path = `imagenes/menu_${timestamp}_${index}_pictogram.png`;
      await this.firebaseService.uploadFile(menu.pictogram.file, menu.pictogram.path);
      menu.pictogram.url = await this.firebaseService.getDownloadURL(menu.pictogram.path);

      //removing the file object before saving
      const { image, pictogram, ...rest } = menu;
      const dataToSave: MenuItem = {
        ...rest,
        image: { url: image.url, path: image.path },
        pictogram: { url: pictogram.url, path: pictogram.path }
      };

      await this.menuService.saveMenu(dataToSave);

    }

    console.log('Datos guardados en Firestore con éxito');
    window.location.reload()
  }

  goBackToAdmin() {
    this.router.navigate(['/admin-dentro']);
  }

}
