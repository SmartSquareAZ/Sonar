import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, TreeNode } from 'primeng/api';
import { AgendaPunkt } from 'src/app/models/Agendapunkt';
import { AgendaService } from 'src/app/service/agenda/agenda.service';

@Component({
  selector: 'app-agendatableentry',
  templateUrl: './agendatableentry.component.html',
  styleUrls: ['./agendatableentry.component.css'],
  providers: [ConfirmationService]
})
export class AgendatableentryComponent implements OnInit {

  @Input() rowNodeList: TreeNode<AgendaPunkt>[] = [];
  @Input() deepth: number = 0;

  @Output() selectAgendapunktEvent = new EventEmitter<TreeNode<AgendaPunkt>>();
  @Output() addAgendapunktEvent = new EventEmitter<TreeNode<AgendaPunkt>>();
  @Output() deleteAgendapunktEvent = new EventEmitter<TreeNode<AgendaPunkt>>();

  /**
   * Zu löschende TreeNode
   */
  choosenAgendapunkt: TreeNode<AgendaPunkt> = {};

  constructor(private agendaService: AgendaService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
  }

  nodeSelect(element: TreeNode<AgendaPunkt>) {
    // Event wird getriggert
    this.selectAgendapunktEvent.emit(element);
  }

  addNewAgendaPunkt(element: TreeNode<AgendaPunkt>) {
    // Leerer AgendaPunkt wird erstellt
    let agendaPunkt = AgendaPunkt.buildFromEmpty();

    // Daten werden gesetzt
    agendaPunkt.ID = 0;
    agendaPunkt.agendaID = element.data == null ? 0 : element.data.agendaID;
    agendaPunkt.parentID = element.data == null ? 0 : element.data.ID;
    agendaPunkt.name = "Name";

    // Neuer Agendapunkt wird als Child hinzugefügt
    element.data?.children.push(agendaPunkt);
    // Neuer Agendapunkt wird als TreeNode beim Parent hinzugefügt
    element.children?.push(AgendaPunkt.createTreeNode(agendaPunkt));

    // Event wird getriggert
    this.addAgendapunktEvent.emit(agendaPunkt);
  }

  showConfirm(event: any, value: TreeNode<AgendaPunkt>) {
    this.choosenAgendapunkt = value;
    
    this.confirmationService.confirm({
      target: event.target,
      message: 'Sind Sie sicher?',
      icon: 'pi pi-exclamation-triangle',
      accept: this.deleteAgendapunkt.bind(this)
    });
  }

  deleteAgendapunkt() {
    if (this.choosenAgendapunkt.data != null) {
      // Agendapunkt wird im Service gelöscht
      this.agendaService.deleteAgendaPunkt(this.choosenAgendapunkt.data);
    }

    // Index des Elements wird gesucht
    let index = this.rowNodeList.findIndex(x => x.data?.ID == this.choosenAgendapunkt.data?.ID);
    // Element wird aus Array entfernt
    this.rowNodeList.splice(index, 1);
    // Array wird neu erstellt
    this.rowNodeList = [...this.rowNodeList];

    // Event wird getriggert
    this.deleteAgendapunktEvent.emit(this.choosenAgendapunkt);
  }

  nodeSelectChild(element: TreeNode<AgendaPunkt>) {
    // Event wird getriggert
    this.selectAgendapunktEvent.emit(element);
  }

  addAgendapunktChild(element: TreeNode<AgendaPunkt>) {
    // Event wird getriggert
    this.addAgendapunktEvent.emit(element);
  }

  deleteAgendapunktChild(element: TreeNode<AgendaPunkt>) {
    // Event wird getriggert
    this.deleteAgendapunktEvent.emit(element);
  }
}
