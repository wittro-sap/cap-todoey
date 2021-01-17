namespace db;

using {cuid} from '@sap/cds/common';
using {db.ColorHex} from './common';

@title       : '{i18n>TaskCollections}'
@description : '{i18n>TaskCollectionsDescr}'
entity TaskCollections : cuid {
  @title : '{i18n>TaskCollectionTitle}'
  title : String(40);
  @title : '{i18n>TaskCollectionType}'
  type  : String(20) enum {
    today;
    scheduled;
    allTasks;
  };
  @title : '{i18n>TaskCollectionColor}'
  color : ColorHex;
}
