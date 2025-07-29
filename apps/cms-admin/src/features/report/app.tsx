import { Header } from '../../components/Layout/Header';
import { Main } from '../../components/Layout/main';
import { ProfileDropdown } from '../../components/profile-dropdown';
import { Search } from '../../components/search';
import { OwnerDialogs } from './actions/report-dialog';
import columns from './components/column';
import { DataTable } from './components/data-table';
import { ReportProvider } from './context/report-context';
import { mockOwners } from './data/mockData';

const ReportApp = () => {
  const data = mockOwners;
  return (
    <ReportProvider>
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
              <h1 className="text-2xl font-bold tracking-tight">Report</h1>
              <p className="text-muted-foreground">Here&apos;s a list of Report</p>
            </div>
            {/* <AddCategory /> */}
          </div>

          <div>
            <DataTable data={data} columns={columns} />
          </div>
        </div>
      </Main>
      <OwnerDialogs />
    </ReportProvider>
  );
};

export default ReportApp;
