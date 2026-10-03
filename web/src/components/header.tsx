import { Button, Typography } from '@heroui/react';

interface HeaderProps {
  onResetRunClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onResetRunClick }) => {
  return (
    <header className="container m-auto flex justify-between py-4">
      <Typography type="h1">Nuzlocke Tracker</Typography>

      <Button variant="tertiary" onClick={onResetRunClick}>
        Reset Run
      </Button>
    </header>
  );
};

export default Header;
