import { Component,Input, OnInit,Output,EventEmitter } from '@angular/core';
import { Observable, of, Subject, empty, fromEvent } from 'rxjs';
import { Constants } from '../../../global/constants';
import { TriggerEventModel } from 'src/app/models/document/document.model';
import { Router } from '@angular/router';
@Component({
    selector: 'document-modal-page',
    templateUrl: 'document-modal-page.component.html',
    styleUrls: ['../../document-page/document-page.component.scss']
})
export class DocumentModalPageComponent implements OnInit {
    @Input() triggerModal: Subject<TriggerEventModel>;
    public modalType = Constants.document.modals.types;
    public eventType =   Constants.document.modals.events; 
    public oldDocument:string;
    public documentName:string;
    @Output() eventModal = new EventEmitter<TriggerEventModel>();
    constructor(
        private router: Router,
    ) { }
    ngOnInit(){
        this.triggerModal.subscribe((modalType)=>{
            if(modalType.action === this.modalType.newDocument.name){
                this.oldDocument =  modalType.data;
                this.openModal("save_document_modal")
            }
        });
    }
    saveDocument(typeSave){
        // console.log('❏ Save : '+ this.documentName);
        // if(typeSave=='new'){
        //     this.eventModal.emit({action:this.eventType.saveNewDocument.name,data:this.documentName});
        //     this.closeModal("create_document_modal");
        // }
        if(typeSave=='old'){
            this.eventModal.emit({action:this.eventType.saveOldDocument.name,data:this.oldDocument});
            this.closeModal("save_document_modal");
            // this.openModal("create_document_modal");
        }

    }
    openModal(id){
        $('[id="' + id + '"]').modal('show');
    }
    closeModal(id){
        $('[id="' + id + '"]').modal('hide');
        if(id==='save_document_modal'){
            this.eventModal.emit({action:this.eventType.cancelSaveDocument.name,data:this.oldDocument});
        }
    }

}
