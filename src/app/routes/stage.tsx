import { RoutesList } from '@/features/encounters/components/routes-list';
import { useRoutesProgress } from '@/features/encounters/hooks/use-routes-progress';

export const Stage = () => {
  const { encounters, selectEncounter } = useRoutesProgress();

  return (
    <>
      <RoutesList encounters={encounters} onSelectEncounter={selectEncounter} />
    </>
  );
};
