namespace srv;

using {db} from '../db';

service TaskService {

  entity Tasks             as projection on db.Tasks actions {
    action setToDone();
    action setToObsolete();
    action reopen();
  };

  entity TaskLists         as projection on db.TaskLists;

  @readonly
  entity TaskPriorityCodes as projection on db.TaskPriorityCodes excluding {
    descr
  };

  @readonly
  entity TaskStatusCodes   as projection on db.TaskStatusCodes excluding {
    descr
  };

  function getDefaultTaskList() returns TaskLists

}
