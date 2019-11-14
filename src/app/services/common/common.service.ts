import { Injectable } from '@angular/core';
import { Constants } from '../../global/constants';
import { PostitionDetailModel, ScreenDetailModel, ElementDetailModel } from '../../models/common/common.model';
import { Observable } from 'rxjs';
import { VideoConetentDataModel } from 'src/app/models/document/elements/video-content.model';

@Injectable()
export class CommonService {
  constructor() { }
  private selfIsPlatform: any;
  public get isPlatform(): any {
    return this.selfIsPlatform;
  }
  public set isPlatform(value: any) {
    this.selfIsPlatform = value;
  }
  public getBoxId(){
    let boxId:number = 0
    if(localStorage.getItem('boxId')){
      boxId = parseInt(localStorage.getItem('boxId')) +1
      localStorage.setItem('boxId',boxId.toString())
    }else{
      localStorage.setItem('boxId','0')
    }
    return boxId
  }
  public setPlatform() {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
      this.isPlatform = Constants.platform.device;
    } else {
      this.isPlatform = Constants.platform.browser;
    }
  }
  public debounce(callback, delay) {
    let timeout;
    return function() {
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        callback.apply(this, args);
      }.bind(this), delay);
    };
  }
  public getStreamId(url: string) :VideoConetentDataModel {
    let streamId = new VideoConetentDataModel();
    try{
      streamId.streamId = url
      streamId.channelStream = 'wistia'
    }catch(err){

    }
      if(url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)){
        streamId.streamId  =url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)[1];
        streamId.channelStream = 'youtube'
      }
      else if(url.match(/(?:https?:\/{2})?.*wistia\.(?:com)(?:\/medias\/)([^\s&]+)/)){
        streamId.streamId  =url.match(/(?:https?:\/{2})?.*wistia\.(?:com)(?:\/medias\/)([^\s&]+)/)[1];
        streamId.channelStream = 'wistia'
      }
      else{
        streamId.streamId = url
        streamId.channelStream = 'wistia'
      }
      // else if(url.match(/(?:https?:\/{2})?.*wistia\.(?:com)(?:\/medias\/)([^\s&]+)/)){
      //   streamId.streamId  =url.match(/(?:https?:\/{2})?.*wistia\.(?:com)(?:\/medias\/)([^\s&]+)/)[1];
      //   streamId.channelStream = 'wistia'
      // }
    // }catch(err){
    //   streamId.streamId = url
    //   streamId.channelStream = 'wistia'
    // }
    return streamId;
  }
  public getPatternId(string:string){
    // string = string.replace(/\s/g,'').toLowerCase();
    let id = string.replace(/\(|\[/g,'_');
    id = id.replace(/\)|\]/g,'');
    id = id.replace(/\s/g,'').toLowerCase()

    // string = string.replace(/\(\d\)/g,numberOfDoc[0])
    return id
  }
  public getPatternAWSName(fileName:string){
    // let filename = fileName.match(/^.*?([^\\/.]*)[^\\/]*$/);
    console.log(this.fileNameAndExt(fileName))
    let arrayFileName = this.fileNameAndExt(fileName)
    let newFileName;
    if(arrayFileName.length>0){
    let currentDate = new Date();
    let day = currentDate.getDate();
    let month = currentDate.getMonth() +1;
    let year = currentDate.getFullYear();
    let hour = currentDate.getHours();
    let minute = currentDate.getMinutes();
    let seconde =  currentDate.getSeconds();
    newFileName  = arrayFileName[0] +day+month+year+hour+minute+seconde+'.'+arrayFileName[1]
    return newFileName;
    }else{
      return fileName;
    }
    // let newFileName;
    // if(fileName.length>0){
    //   newFileName = filename[1];
    // }else{
    //   newFileName = fileName;
    // }
    // let currentDate = new Date();
    // let day = currentDate.getDay();
    // let month = currentDate.getMonth();
    // let year = currentDate.getFullYear();
    // let hour = currentDate.getHours();
    // let minute = currentDate.getMinutes();
    // let seconde =  currentDate.getSeconds();
    // console.log('day=>',day,'month=>',month,'year=>',year,'hour',hour,'minute',minute,'seconde',seconde)
    // newFileName  += (day+month+year+hour+minute+seconde+'.'+this.getFileExtension(fileName))
    // return newFileName;
  }
  fileNameAndExt(filName){
    let newFileName = filName.split('/').pop();
    return [newFileName.substr(0,newFileName.lastIndexOf('.')),newFileName.substr(newFileName.lastIndexOf('.')+1,newFileName.length)]
  }

  public calPositionCenter(parenteElement, targetElement:JQuery<Element>):PostitionDetailModel{
    let positionElement = new PostitionDetailModel();
    positionElement.top =  Math.max(0, (($(parenteElement).height() - $(targetElement).outerHeight()) / 2) + 
                                                $(parenteElement).scrollTop())
    positionElement.left =Math.max(0, (($(parenteElement).width() - $(targetElement).outerWidth()) / 2) + 
                                                $(parenteElement).scrollLeft())

                                                // console.log($(window).height())
                                                // console.log($(window).width())
                                                // console.log(parenteElement.outerHeight());
                                                // console.log(parenteElement.outerWidth());
    return positionElement;
  }
  public calGCD (a, b) {
    return (b == 0) ? a : this.calGCD (b, a%b);
  }
  public calPositionForNewScreen(element,oldScreen):Observable<ElementDetailModel>{
    return  new Observable((subscriber)=>{
      let elementDetail = new ElementDetailModel();
      elementDetail.postitionDetail.top =  ( 100 * parseFloat( ($(element).position().top / oldScreen.height).toString() ));
      elementDetail.postitionDetail.left = ( 100 * parseFloat( ($(element).position().left / oldScreen.width).toString() ));
      elementDetail.screenDetail.width =   ($(element).width()/oldScreen.width*100);
      elementDetail.screenDetail.height = ($(element).height()/oldScreen.height*100);
      subscriber.next(elementDetail);
    });
  }
  public getCurrentCaret(){
    return window.getSelection()

  }
}
