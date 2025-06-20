import styles from '../app/page.module.css';

interface bombNumProps {
  leftbombnumleft: number;
  leftbombnumcenter: number;
  leftbombnumright: number;
}

export function LeftBombNum({
  leftbombnumleft,
  leftbombnumcenter,
  leftbombnumright,
}: bombNumProps) {
  return (
    <div className={styles.leftbomb}>
      <div
        className={styles.leftbombnum}
        style={{
          backgroundPosition: -30 * leftbombnumleft - 5.7,
        }}
      />
      <div
        className={styles.leftbombnum}
        style={{
          backgroundPosition: -30 * leftbombnumcenter - 5.7,
        }}
      />
      <div
        className={styles.leftbombnum}
        style={{
          backgroundPosition: -30 * leftbombnumright - 5.7,
        }}
      />
    </div>
  );
}
