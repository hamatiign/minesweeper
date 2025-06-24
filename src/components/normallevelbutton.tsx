import styles from '../app/page.module.css';
interface NormalLevelButtonProps {
  levelstr: string;
  onNormalLevelButton: () => void;
}

export function NormalLevelButton({ levelstr, onNormalLevelButton }: NormalLevelButtonProps) {
  return (
    <div
      className={levelstr === 'normal' ? styles.currentlevel : styles.level}
      onClick={onNormalLevelButton}
    >
      中級
    </div>
  );
}
