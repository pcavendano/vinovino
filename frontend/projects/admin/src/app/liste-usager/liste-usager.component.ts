import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { AdminService } from '../admin.service';
import { IUser } from '../iuser';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AuthStateService } from 'projects/admin/src/app/shared/auth-state.service';
import { TokenService } from 'projects/admin/src/app/shared/token.service';
import { AuthService } from 'projects/admin/src/app/shared/auth.service';

@Component({
  selector: 'app-liste-usager',
  templateUrl: './liste-usager.component.html',
  styleUrls: ['./liste-usager.component.scss']
})

export class ListeUsagerComponent implements OnInit {

  isSignedIn! : boolean;
  isOpen : boolean = true;
  utilisateur : IUser;
  utilisateurs : Array<IUser>;
  dataSource : MatTableDataSource<IUser>;
  colonnesAffichees : string[] = ['id', 'name', 'email', 'type', 'created_at'];
  @ViewChild(MatSort) sort: MatSort;

  /**
   * Constructeur de la classe ListeUsagerComponent
   * @param auth composant AuthStateService
   * @param token composant TokenService
   * @param authService composant AuthService
   * @param adminServ composant AdminService
   * @param snackBar composant MatSnackBar
   * @param dialog composant MatDialog
   * @param _liveAnnouncer composant LiveAnnouncer
   */
  constructor(
    private auth: AuthStateService,
    public token: TokenService,
    public authService: AuthService,
    private adminServ:AdminService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer) {
  }

  /**
   * Fonction initiale dès l'instanciation de la classe
   */
  ngOnInit() {
    this.auth.userAuthState.subscribe((val) => {
      this.isSignedIn = val;
    });
    this.afficherListeUtilisateur();
  }

  /**
   * Fonction qui affiche la liste des usagers (utilisateurs et administrateurs)
   */
  afficherListeUtilisateur() {
    this.adminServ.getUtilisateur().subscribe((listeUtilisateur)=>{
      this.utilisateurs = listeUtilisateur.data;
      this.utilisateurs.forEach(utilisateur => {
        utilisateur.created_at=utilisateur.created_at?.split("T")[0];
        utilisateur.created_at=utilisateur.created_at?.split("-").reverse().join("-");
        utilisateur.updated_at=utilisateur.updated_at?.split("T")[0];
        utilisateur.updated_at=utilisateur.updated_at?.split("-").reverse().join("-");
        if(utilisateur.type === "0") {
          utilisateur.type = "Utilisateur";
        } else if (utilisateur.type === "1") {
          utilisateur.type = "Administrateur";
        }
      });
      this.dataSource = new MatTableDataSource(this.utilisateurs);
      this.dataSource.sort = this.sort;
    });
  }

 supprimer(utilisateur:IUser) {
    console.log(utilisateur);
    let dialogRef = this.dialog.open(ModalComponent, {data: {nom: utilisateur.name, id: utilisateur.id}});
    dialogRef.afterClosed().subscribe((retour:string) =>{
      console.log(retour);
      if(retour === 'false') {
        console.log('utilisateur supprimé');
        this.adminServ.effacerUtilisateur(utilisateur.id).subscribe((result)=>{
          console.log(utilisateur.id);
          console.log(result);
          this.afficherListeUtilisateur();
        });
      }
    });
  }

  /**
   * Fonction qui permet de filtrer les usagers
   * @param event Event - Sur l'événement
   */
  filtrer(event: Event) {
    const valeur = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valeur.trim().toLowerCase();
  }

  /**
   * Fonction qui annonce les usagers filtrés
   * @param sortState 
   */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
