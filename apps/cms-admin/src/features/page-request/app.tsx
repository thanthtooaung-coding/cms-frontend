import { Header } from '../../components/Layout/Header';
import { Main } from '../../components/Layout/main';
import { ProfileDropdown } from '../../components/profile-dropdown';
import { Search } from '../../components/search';
import { mockPageRequests } from './data/mockData';
import { DataTable } from './components/data-table';
import columns from './components/column';
import { PageRequestProvider } from './context/page-request-context';
import { PageRequestDialogs } from './actions/page-request-dialog';
import { fetchPageRequestsQuery } from '@cms/data';
import { useSuspenseQuery } from '@tanstack/react-query';

const PageRequestApp = () => {
  const { data: pageRequestsList } = useSuspenseQuery(fetchPageRequestsQuery());
  const data = pageRequestsList.data || mockPageRequests;
  return (
    <PageRequestProvider>
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
              <h1 className="text-2xl font-bold tracking-tight">Page Request Lists</h1>
              <p className="text-muted-foreground">Here&apos;s a list of Page Resquest</p>
            </div>
            {/* <AddCategory /> */}
          </div>

          <div>
            <DataTable data={data} columns={columns} />
          </div>
        </div>
      </Main>
      <PageRequestDialogs />
    </PageRequestProvider>
  );
};

export default PageRequestApp;
