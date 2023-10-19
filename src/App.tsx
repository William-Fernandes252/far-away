import Logo from './components/Logo';
import Stats from './components/Stats';
import NewPackingItemForm from './components/NewPackingItemForm';
import PackingList from './components/PackingList';
import { PackingItemsProvider } from './providers/packingItems';

export default function App() {
  return (
    <div className="app">
      <PackingItemsProvider>
        <Logo />
        <NewPackingItemForm />
        <PackingList />
        <Stats />
      </PackingItemsProvider>
    </div>
  );
}
