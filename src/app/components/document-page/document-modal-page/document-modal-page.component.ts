import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
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
    public eventType = Constants.document.modals.events;
    public documentId: string;
    public actions = {
        event: {
            saveDocument: 'saveDocument',
            deleteDocument: 'deleteDocument'
        }
    }
    @Output() eventModal = new EventEmitter<TriggerEventModel>();
    constructor(
        private router: Router,
    ) { }
    ngOnInit() {
        this.triggerModal.subscribe((modalType) => {
            if (modalType.action === this.modalType.newDocument.name) {
                this.documentId = modalType.data;
                this.openModal('save_document_modal');
            }
            else if (modalType.action === this.modalType.deleteDocument.name) {
                this.documentId = modalType.data;
                this.openModal('delete_document_modal');
            }
        });
    }
    documentEvent(action) {
        if (action === 'save') {
            this.eventModal.emit({ action: this.eventType.saveOldDocument.name, data: this.documentId });
            this.closeModal('save_document_modal');
            // this.openModal("create_document_modal");
        }
        if (action === 'delete') {
            this.eventModal.emit({ action: this.eventType.deleteDocument.name, data: this.documentId });
            this.closeModal('delete_document_modal')
        }

    }
    openModal(id) {
        $('[id="' + id + '"]').modal('show');
    }
    closeModal(id) {
        $('[id="' + id + '"]').modal('hide');
        if (id === 'save_document_modal') {
            this.eventModal.emit({ action: this.eventType.cancelSaveDocument.name, data: this.documentId });
        }
    }

}
