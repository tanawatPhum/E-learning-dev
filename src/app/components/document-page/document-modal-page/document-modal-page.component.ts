import { Component,Input, OnInit,Output,EventEmitter } from '@angular/core';
import { Observable, of, Subject, empty, fromEvent } from 'rxjs';
import { Constants } from '../../../global/constants';
import { triggerEventModel } from 'src/app/models/document/document.model';
@Component({
    selector: 'document-modal-page',
    templateUrl: 'document-modal-page.component.html',
    styleUrls: ['../../document-page/document-page.component.scss']
})
export class DocumentModalPageComponent implements OnInit {
    @Input() triggerModal: Subject<triggerEventModel>;
    public modalType = Constants.document.modals.types;
    public eventType =   Constants.document.modals.events; 
    public oldDocument:string;
    public documentName:string;
    @Output() eventModal = new EventEmitter<triggerEventModel>();
    ngOnInit(){
        this.triggerModal.subscribe((modalType)=>{
            if(modalType.action === this.modalType.newDocument.name){
                this.oldDocument =  modalType.data;
                this.openModal("save_document_modal")
            }
        });
    }
    saveDocument(typeSave){
        console.log('❏ Save : '+ this.documentName);
        if(typeSave=='new'){
            this.eventModal.emit({action:this.eventType.saveNewDocument.name,data:this.documentName});
            this.closeModal("create_document_modal");
        }
        else if(typeSave=='old'){
            this.eventModal.emit({action:this.eventType.saveOldDocument.name,data:this.oldDocument});
            this.closeModal("save_document_modal");
            this.openModal("create_document_modal");
        }

    }
    openModal(id){
        $('[id="' + id + '"]').modal('show');
    }
    closeModal(id){
        $('[id="' + id + '"]').modal('hide');
    }

}
