import { Header } from '../../components/Layout/Header';
import { Search } from '../../components/search';
import { ProfileDropdown } from '../../components/profile-dropdown';
import { Main } from '../../components/Layout/main';

const DashboardApp = () => {
  return (
    <div>
      <Header>
        <Search />
        <div className="ml-auto flex items-center gap-4">
          <ProfileDropdown />
        </div>
      </Header>
      <Main>Dashboard Goes Heere</Main>
    </div>
  );
};

export default DashboardApp;
