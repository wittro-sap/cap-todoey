namespace db;

using {sap.common.CodeList} from '@sap/cds/common';

@title : '{i18n>TaskPriorityCodesTitle}'
entity TaskPriorityCodes : CodeList {
      @title : '{i18n>TaskPriorityCodeTitle}'
  key code : Integer;
}

type TaskPriorityCode : Association to TaskPriorityCodes;
