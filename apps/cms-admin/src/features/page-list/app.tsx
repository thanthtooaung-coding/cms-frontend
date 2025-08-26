import { Header } from '../../components/Layout/Header';
import { Main } from '../../components/Layout/main';
import { ProfileDropdown } from '../../components/profile-dropdown';
import { Search } from '../../components/search';

import { DataTable } from './components/data-table';
import columns from './components/column';
import { PageListDialogs } from './actions/page-list-dialog';
import { PageListProvider } from './context/page-list-context';
import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchPagesQuery } from '@cms/data';
import { mockPages } from './data/mockData';
import { ApiPageSchema, type PageList } from './data/schema';

const PageListsApp = () => {
  const { data: pageList } = useSuspenseQuery(fetchPagesQuery());

  const validatedData = ApiPageSchema.array().parse(pageList.data || []);

  const formattedData: PageList[] = (validatedData || []).map((item) => ({
    id: item.id.toString(),
    pageName: item.title,
    pageUrl: item.pageUrl || `/page/${item.id}`,
    ownerName: item.owner.username,
    ownerEmail: item.owner.email,
    pageStatus: item.status,
  }));

  const data = pageList.data || mockPages;
  return (
    <PageListProvider>
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
              <h1 className="text-2xl font-bold tracking-tight">Page Lists</h1>
              <p className="text-muted-foreground">Here&apos;s a list of Pages</p>
            </div>
            {/* <AddCategory /> */}
          </div>

          <div>
            <DataTable data={formattedData} columns={columns} />
            <PageListDialogs />
          </div>
        </div>
      </Main>
    </PageListProvider>
  );
};

export default PageListsApp;
