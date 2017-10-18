import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Mensaje } from '../interface/mensaje.interface';

@Injectable()
export class ChatService {
  private chatsCollection: AngularFirestoreCollection<any>;
  chats: Observable<any[]>;
  usuario:any = null;

  constructor(private db: AngularFirestore, public afAuth: AngularFireAuth) {
    if( localStorage.getItem('usuario') ){
        this.usuario = JSON.parse( localStorage.getItem('usuario') );
      }
    }

    cargarMensajes(){
      this.chatsCollection = this.db.collection('chats', ref => ref.limit(20));
      this.chats = this.chatsCollection.valueChanges();
      return this.chats;
    }

    agregarMensaje( texto:string ){
      let mensaje:Mensaje = {
        nombre:this.usuario.displayName,
        mensaje: texto,
        uid: this.usuario.uid
      }

      return this.chatsCollection.add( mensaje );

    }

    login( proveedor:string ) {
      let provider:any;
      if( proveedor == "google" ){
        provider =  new firebase.auth.GoogleAuthProvider();
      }else{
        provider =  new firebase.auth.FacebookAuthProvider();
      }
      this.afAuth.auth.signInWithPopup( provider )
                  .then( resp =>{

                    this.usuario = resp.user;
                    console.log(resp);
                    localStorage.setItem('usuario', JSON.stringify(this.usuario));

                  });
    }
    logout() {
      localStorage.removeItem('usuario');
      this.usuario = null;
      this.afAuth.auth.signOut();
    }
}
