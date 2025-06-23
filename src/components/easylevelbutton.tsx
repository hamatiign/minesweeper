import styles from '../app/page.module.css';
interface EasyLevelButtonProps {
  levelstr: string;
  oneasylevelbutton: () => void;
}

export function EasyLevelButton({ levelstr, oneasylevelbutton }: EasyLevelButtonProps) {
  return (
    <div
      className={levelstr === 'easy' ? styles.currentlevel : styles.level}
      onClick={oneasylevelbutton}
    >
      初級
    </div>
  );
}
