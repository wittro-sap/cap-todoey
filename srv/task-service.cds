namespace srv;

using {db} from '../db';

service TaskService {

  @readonly
  entity TaskPriorityCodes as projection on db.TaskPriorityCodes excluding {
    descr
  };

}
