import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';
import { getUserSettings } from './actions';
import SettingsForm from './settings-form';

export default async function SettingsPage() {
  const settings = await getUserSettings();

  return (
    <div className="min-h-screen bg-shopbg">
      <Sidebar />
      <main className="lg:ml-[280px] min-h-screen flex flex-col">
        <div className="p-4 md:p-8 max-w-3xl flex-1">
          <header className="mb-10">
            <h2 className="font-jakarta text-3xl font-bold text-on-surface mb-2">Settings</h2>
            <p className="text-on-surface-variant">Manage your account preferences and brand defaults.</p>
          </header>

          <SettingsForm initialSettings={settings} />
        </div>
        <Footer />
      </main>
    </div>
  );
}
