import { Button, Typography } from "@heroui/react";

const Header: React.FC<{
  onResetRunClick: () => void;
}> = ({ onResetRunClick }) => {
  return (
    <header className="container m-auto py-4 flex justify-between">
      <Typography type="h1">Nuzlocke Tracker</Typography>

      <Button variant="tertiary" onClick={onResetRunClick}>
        Reset Run
      </Button>
    </header>
  );
};

export default Header;
