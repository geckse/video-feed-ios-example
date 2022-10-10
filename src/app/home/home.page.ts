import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  challenges: any;
  entries: any;

  vertIndex = 0;
  playIndex = 0;

  horiIndex = 0;
  horiPlayIndex = 0;
  horizontalScrollTimeout: any = -1;
  @ViewChild('horizontalSlider') horizontalSlider: ElementRef;


  constructor(private http: HttpClient) {
    this.fetchExample();
  }

  public fetchExample() {
    this.http.get('https://api.spotshot.io/api/v1/challenge/feed').toPromise().then((data) => {
      this.challenges = data;
    }).catch((error) => {
      console.log('Feed loading error: ',error);
    });

    this.http.get('https://api.spotshot.io/api/v1/spotshots').toPromise().then((data) => {
      this.entries = data;
    }).catch((error) => {
      console.log('Feed loading error: ',error);
    });

  }

  onVideoEnded(ev){
    ev.target.play(); // in prod we implemented here view counter tracking, so we donut use autoplay and loop properties
  }

  feedScrolling(ev){

    let target = ev.srcElement;
    let scrollTop = target.scrollTop;
    let scrollHeight = target.scrollHeight;

    // check if childs are in view (atleast half of it)
    let childs = target.children;
    let childsInView = [];
    for(let i = 0; i < childs.length; i++){
      let child = childs[i];
      let rect = child.getBoundingClientRect();
      let visible = false;

      if( ((rect.top <= 0 && rect.top >= -rect.height/2) && (rect.bottom <= rect.height && rect.bottom > rect.height/2)) ){
        childsInView.push(child);
        visible = true;
      } else if(rect.top <= rect.height/2 && rect.top > 0 && rect.bottom < rect.height*1.5 && rect.bottom > 0){
        childsInView.push(child);
        visible = true;
      } 

      if(Math.round(rect.top) == 0){
        this.vertIndex = i;
      } 
      
      // trigger or stop video playing
      if(visible && !child.classList.contains('active')){
        child.classList.add('active');
        this.playIndex = i;
        this.checkVideosToPlay();
      }
      if(!visible && child.classList.contains('active')){
        child.classList.remove('active');
      }
    }

  }


  horizontalScrolling(ev: any){
    let target = ev.srcElement;
    
    let oldPlayIndex = this.horiPlayIndex;

    let scrollElement = target;

    // check if childs are in view (atleast half of it)
    let childs = target.children;
    let childsInView = [];
    for(let i = 0; i < childs.length; i++){
      let child = childs[i];
      let rect = child.getBoundingClientRect();
      let visible = false;

      if( ((rect.left <= 0 && rect.left >= -rect.width/2) && (rect.right <= rect.width && rect.right > rect.width/2)) ){
        childsInView.push(child);
        visible = true;
      } else if(rect.left <= rect.width/2 && rect.right > 0 && rect.left < rect.width*1.5 && rect.right > 0){
        childsInView.push(child);
        visible = true;
      } 

      if(Math.round(rect.left) == 0){
        this.horiIndex = i;
      }

      // trigger or stop video playing
      if(visible && !child.classList.contains('active')){
        child.classList.add('active');
        this.horiPlayIndex = i;
      }
      if(!visible && child.classList.contains('active')){
        child.classList.remove('active');
      }
    }

    for(let i = 0; i < scrollElement.children.length; i++){
      if(scrollElement.children[i].classList.contains('active')) this.horiPlayIndex = i;
    }
    
    // scroll finish fake event, hence there is no one at this point
    if(ev.scrollFinished){
      // somehow the class is correctly set, but the index not
      for(let i = 0; i < scrollElement.children.length; i++){
        if(scrollElement.children[i].classList.contains('active')) this.horiPlayIndex = i;
      }
      this.horiIndex = this.horiPlayIndex;
      this.checkVideosToPlay();
    }
    if(!ev.noTimeoutEvent){
      if(this.horizontalScrollTimeout) clearTimeout(this.horizontalScrollTimeout);
      this.horizontalScrollTimeout = setTimeout(() => {
        this.horizontalScrolling({srcElement: scrollElement, scrollFinished: true, noTimeoutEvent: true});
      },100);
    }

    if(oldPlayIndex != this.horiPlayIndex){
      this.checkVideosToPlay();
    }

   }

   checkVideosToPlay(){     
      console.log("video y"+this.playIndex+" x"+this.horiPlayIndex+" should play");
  
      // stop all videos
      let videos = document.querySelectorAll('video');
      for(let i = 0; i < videos.length; i++){
        videos[i].pause();
      }

      // play active video 
      let activeVideo = document.querySelector('.item-'+this.playIndex+'-'+this.horiPlayIndex+' video');
      console.log(activeVideo);
      if(activeVideo){
        // @ts-ignore
        setTimeout(() => {
          // @ts-ignore
          if(activeVideo.paused) activeVideo.play();
        },100);
      }
    }

}
