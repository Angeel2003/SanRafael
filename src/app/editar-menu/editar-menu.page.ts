import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { arrowBackOutline, personCircleOutline, addOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FirebaseService } from '../services/firebase.service';
import { MenuService } from '../services/menu.service';
import { saveOutline } from 'ionicons/icons';
import { trashOutline } from 'ionicons/icons';

import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonCol, IonGrid, IonRow, IonItem, IonLabel, IonIcon, IonButton, IonInput, IonFooter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

export interface MenuItem {
  id?: string;
  name: string;
  pictogram: {
    url: string,
    path: string,
    file?: File
  };
  image: {
    url: string,
    path: string,
    file?: File
  };
  edited?: boolean;
}

@Component({
  selector: 'app-editar-menu',
  templateUrl: './editar-menu.page.html',
  styleUrls: ['./editar-menu.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonCol, IonGrid, IonRow, IonItem, IonLabel, IonIcon, IonButton, IonInput, IonFooter]
})

export class EditarMenuPage implements OnInit {

  taskPreview: File | null = null;
  previewUrl: string | null = null;

  menus: MenuItem[] = [
    // Example of a menu item
    // {
    //   id: '1173419Y7',
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
    //   },
    //   edited: undefined
    // }
  ];

  removedMenus: MenuItem[] = [];

  addMenu() {
    this.menus.push(
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


  loadFile(event: Event, editedMenuIndex: number, isImage: boolean) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const subMenu = this.menus[editedMenuIndex][isImage ? 'image' : 'pictogram'];
      // if the menu already had a file, mark it as edited
      // we could also check the menu.id, it might makes more sense
      if (subMenu.path) {
        this.menus[editedMenuIndex].edited = true;
      }
      subMenu.file = file;
      subMenu.url = URL.createObjectURL(file);
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

    // Loop to save edited/new menus
    for (const [index, menu] of this.menus.filter(m => m.edited).entries()) {

      if (!menu.name) {
        this.errorFormNotFilled();
        return
      }

      if (menu.id) {
        //remove the old image if edited
        if (menu.pictogram.file) {
          await this.firebaseService.deleteFile(menu.pictogram.path);
        }
        if (menu.image.file) {
          await this.firebaseService.deleteFile(menu.image.path);
        }
      } else {
        // check if the new menu has all the required fields
        if (!menu.pictogram.file || !menu.image.file) {
          this.errorFormNotFilled();
          return
        }
      }

      //save image
      if (menu.image.file) {
        menu.image.path = `imagenes/menu_${timestamp}_${index}_image.png`;
        await this.firebaseService.uploadFile(menu.image.file, menu.image.path);
        menu.image.url = await this.firebaseService.getDownloadURL(menu.image.path);
      } else {
        if (!menu.id) {
          console.error("this error shouldn't happen, because we checked that the menu had all the required fields, before starting to save any elements");
          return
        }
      }

      //save picto
      if (menu.pictogram.file) {
        menu.pictogram.path = `imagenes/menu_${timestamp}_${index}_pictogram.png`;
        await this.firebaseService.uploadFile(menu.pictogram.file, menu.pictogram.path);
        menu.pictogram.url = await this.firebaseService.getDownloadURL(menu.pictogram.path);
      } else {
        if (!menu.id) {
          console.error("this error shouldn't happen, because we checked that the menu had all the required fields, before starting to save any elements");
          return
        }
      }

      //remove the file object if any
      const { image, pictogram, ...rest } = menu;
      const dataToSave: MenuItem = {
        ...rest,
        image: { url: image.url, path: image.path },
        pictogram: { url: pictogram.url, path: pictogram.path }
      };

      //save menu
      if (menu.id) {
        await this.menuService.updateMenu(menu.id, dataToSave);
      } else {
        await this.menuService.saveMenu(dataToSave);
      }
    }

    console.log('Datos guardados en Firestore con éxito');
    this.goBackToAdmin();
  }

  goBackToAdmin() {
    this.router.navigate(['/perfil-admin-profesor']);
  }

  errorFormNotFilled() {
    //TODO notify user, forms are not correctly filled
    console.log('Formulario no rellenado correctamente');
  }

}
