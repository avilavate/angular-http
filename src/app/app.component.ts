import {
  Component,
  OnInit
} from '@angular/core';
import {
  NgForm
} from '@angular/forms';
import {
  HttpClient
} from '@angular/common/http';
import {
  Post
} from './posts';
import {map} from "rxjs/operators";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ng-http-demo';
  loadedData: Post[] = [];
  error:Error|null = null;

  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.fetchPosts();
  }
  submit(f: NgForm) {
    this.http.post(
        'https://recipe-app-service-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json',
        f.value)
      .subscribe(respData => {
        this.fetchPosts();
        this.error=null;
      },error=>{
        this.error=new Error(error.message);
      });

      f.resetForm();
     
  }

  fetchPosts() {
    this.http.get < {[key: string]: Post} > (
        'https://recipe-app-service-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json',
      )
      .pipe(
        map(
        data => {
        let out: Post[] = [];
        let keys = Object.keys(data);
        for(const key in data) {
          out.push({...data[key]});
        }
        return out;
      })
      )
      .subscribe(respData => {
        this.loadedData=respData;
        console.log(respData);
        this.error=null;
      },error=>{
        this.error=new Error(error.message);
      });
  }

  clearAll() {
    this.http.delete('https://recipe-app-service-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json').
    subscribe(() => {
      this.loadedData = [];
      this.error=null;
    }, error=>{
      this.error=new Error(error.message);
    })

  }

}
