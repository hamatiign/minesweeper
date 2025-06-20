import styles from '../app/page.module.css';
interface ResetButtomProps {
  onReset: () => void;
  isClear: boolean;
  isGameover: boolean;
}
export function ResetButtom({ onReset, isClear, isGameover }: ResetButtomProps) {
  return (
    <div
      onClick={onReset}
      className={styles.faceicon}
      style={{
        backgroundPosition: isGameover ? -390 : isClear ? -360 : -330,
      }}
    />
  );
}
