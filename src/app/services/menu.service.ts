import { addDoc, collection, deleteDoc, doc, DocumentData, getDocs, updateDoc } from "firebase/firestore";
import { FirebaseService } from "./firebase.service";
import { Injectable } from "@angular/core";
import { MenuItem } from "../editar-menu/editar-menu.page";


@Injectable({
    providedIn: 'root'
})
export class MenuService {



    constructor(private firebaseService: FirebaseService) { }


    async saveMenu(menuData: any): Promise<void> {
        const menusCollection = collection(this.firebaseService.db, 'menus');

        try {
            await addDoc(menusCollection, menuData);
            console.log('Menu guardado con éxito');
        } catch (error) {
            console.error('Error al guardar el menu: ', error);
            throw new Error('Error al guardar el menu');
        }
    }

    async updateMenu(menuId: any, menuData: any): Promise<void> {
        try {
            const menuDoc = doc(this.firebaseService.db, 'menus', menuId);
            await updateDoc(menuDoc, menuData);
            console.log('Menu guardado con éxito');
        } catch (error) {
            console.error('Error al guardar el menu: ', error);
            throw new Error('Error al guardar el menu');
        }
    }

    async removeMenu(menuId: any): Promise<void> {
        const menusCollection = collection(this.firebaseService.db, 'menus');

        try {
            const menuDoc = doc(this.firebaseService.db, 'menus', menuId);
            await deleteDoc(menuDoc);
            console.log('Menu eliminado con éxito');
        } catch (error) {
            console.error('Error al guardar el menu: ', error);
            throw new Error('Error al guardar el menu');
        }
    }


    async getMenus(): Promise<MenuItem[]> {
        const menusCollection = collection(this.firebaseService.db, 'menus');
        try {
            // Retrieve all documents in the 'menus' collection
            const querySnapshot = await getDocs(menusCollection);

            // Map through the documents and return their data along with their IDs
            const menus = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as MenuItem)
            }));

            console.log('Menus retrieved successfully');
            return menus;
        } catch (error) {
            console.error('Error retrieving menus: ', error);
            throw new Error('Error retrieving menus');
        }
    }


}