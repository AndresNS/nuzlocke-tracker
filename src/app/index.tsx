import Header from '@/components/header';
import RoutesList from '@/features/encounters/components/routes-list';
import useRoutesProgress from '@/features/encounters/hooks/use-routes-progress';

function App() {
  const { encounters, selectEncounter, resetRun } = useRoutesProgress();

  return (
    <>
      <Header onResetRunClick={resetRun} />
      <main className="container m-auto">
        <RoutesList
          encounters={encounters}
          onSelectEncounter={selectEncounter}
        />
      </main>
    </>
  );
}

export default App;
