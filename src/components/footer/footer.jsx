import React from 'react';
import styles from './footer.module.css';

export default function Footer({ title, subtitle }) {
  return (
    <footer className={styles.footer}>
      <h1 className={styles['footer-title']}>{title}</h1>
      {subtitle && <p className={styles['footer-subtitle']}>{subtitle}</p>}
    </footer>
  );
}

