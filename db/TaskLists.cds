namespace db;

using {cuid} from '@sap/cds/common';
using {db.ColorHex} from './common';
using {db.Tasks} from './Tasks';

@title       : '{i18n>TaskLists}'
@description : '{i18n>TaskListsDescr}'
entity TaskLists : cuid {
  @title : '{i18n>TaskListTitle}'
  @mandatory
  title     : String(40);
  @title : '{i18n>TaskListColor}'
  color     : ColorHex;
  @title : '{i18n>TaskListIsDefault}'
  @readonly
  isDefault : Boolean default false;
  @title : '{i18n>TaskListTasks}'
  tasks     : Association to many Tasks
                on tasks.taskList = $self;
}
