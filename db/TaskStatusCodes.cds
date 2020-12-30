namespace db;

using {sap.common.CodeList} from '@sap/cds/common';

@title : '{i18n>TaskStatusCodes}'
entity TaskStatusCodes : CodeList {
      @title : '{i18n>TaskPriorityCode}'
  key code : String(1);
}

type TaskStatusCode : Association to TaskStatusCodes;
