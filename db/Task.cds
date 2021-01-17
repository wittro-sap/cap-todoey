namespace db;

using {cuid} from '@sap/cds/common';
using {db.TaskLists} from './TaskList';
using {db.TaskPriorityCode} from './TaskPriorityCodes';
using {db.TaskStatusCode} from './TaskStatusCodes';

@title       : '{i18n>Tasks}'
@description : '{i18n>TasksDescr}'
entity Tasks : cuid {
  @title : '{i18n>TaskTitle}'
  @mandatory
  title       : String(80);
  @title : '{i18n>TaskTaskList}'
  @mandatory
  taskList    : Association to TaskLists;
  @title : '{i18n>TaskPriority}'
  priority    : TaskPriorityCode;
  @title : '{i18n>TaskDueDate}'
  dueDate     : Date;
  @title : '{i18n>TaskDueTime}'
  dueTime     : Time;
  @title : '{i18n>TaskStatus}'
  status      : TaskStatusCode not null;
  @title : '{i18n>TaskIsCompleted}'
  @readonly
  isCompleted : Boolean not null;
  @title : '{i18n>TaskIsDueToday}'
  isDueToday  : Boolean not null default false;
}
