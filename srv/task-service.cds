namespace srv;

using {db} from '../db';

service TaskService {

  entity Tasks             as projection on db.Tasks;
  entity TaskLists         as projection on db.TaskLists;

  @readonly
  entity TaskCollections   as
    select from db.TaskCollections
    mixin {
      tasks : Association to many Tasks
                on tasks.ID = ID
    }
    into {
      ID,
      title,
      color,
      tasks
    };

  @readonly
  entity TaskPriorityCodes as projection on db.TaskPriorityCodes excluding {
    descr
  };

  @readonly
  entity TaskStatusCodes   as projection on db.TaskStatusCodes excluding {
    descr
  };

  function getDefaultTaskList() returns TaskLists;

}
