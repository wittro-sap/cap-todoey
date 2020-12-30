namespace db;

using {sap.common.CodeList} from '@sap/cds/common';

@title : '{i18n>TaskPriorityCodes}'
entity TaskPriorityCodes : CodeList {
      @title : '{i18n>TaskPriorityCode}'
  key code : Integer;
}

type TaskPriorityCode : Association to TaskPriorityCodes;
