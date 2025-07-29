import { useSuspenseQuery } from '@tanstack/react-query';
import { Header } from '../../components/Layout/Header';
import { Main } from '../../components/Layout/main';
import { ProfileDropdown } from '../../components/profile-dropdown';
import { Search } from '../../components/search';
import { OwnerDialogs } from './actions/owner-dialog';
import columns from './components/column';
import { DataTable } from './components/data-table';
import { OwnerProvider } from './context/owner-context';

import { FetchOwnerQuery } from '@cms/data';

const OwnerApp = () => {
  const { data: ownerData } = useSuspenseQuery(FetchOwnerQuery());

  return (
    <OwnerProvider>
      <Header>
        <Search />
        <div className="ml-auto flex items-center gap-4">
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="mb-2 space-y-4 ">
          <div className="flex justify-between items-center space-x-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Owner Lists</h1>
              <p className="text-muted-foreground">Here&apos;s a list of Ower</p>
            </div>
            {/* <AddCategory /> */}
          </div>

          <div>
            <DataTable data={ownerData.data} columns={columns} />
          </div>
        </div>
      </Main>
      <OwnerDialogs />
    </OwnerProvider>
  );
};

export default OwnerApp;
