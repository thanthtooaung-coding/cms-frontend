import { Header } from '../../components/Layout/Header';
import { Search } from '../../components/search';
import { ProfileDropdown } from '../../components/profile-dropdown';
import { Main } from '../../components/Layout/main';
import { ChangePassword } from './components/ChangePassword';

const SettingsApp = () => {
  return (
    <div>
      <Header>
        <Search />
        <div className="ml-auto flex items-center gap-4">
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="w-full p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Settings</h1>
            <p className="text-slate-600">Manage your account settings and preferences</p>
          </div>

          <div className="space-y-6">
            <ChangePassword />
          </div>
        </div>
      </Main>
    </div>
  );
};

export default SettingsApp;

