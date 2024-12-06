import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.page.html',
  styleUrls: ['./tags.page.scss'],
})
export class TagsPage implements OnInit {

  tags: string[] = ['Casa', 'Estudio', 'Ocio'];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  editTag(tag: string) {
    this.router.navigate(['/edit-tag', { tag: tag }]);
  }
}
