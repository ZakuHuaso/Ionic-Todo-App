import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/service/StorageService';
@Component({
  selector: 'app-tags',
  templateUrl: './tags.page.html',
  styleUrls: ['./tags.page.scss'],
})
export class TagsPage implements OnInit {

  

  constructor(private router: Router,
    private StorageService : StorageService
  ) { }

  ngOnInit() {
    
  }

  


  async seleccionarEtiqueta(tag: string){
      await this.StorageService.set('TAG',tag);
      this.router.navigate(['/edit-tag']);
  }
}
