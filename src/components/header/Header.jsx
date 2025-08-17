import React from 'react';
import styles from './Header.module.css';

export default function Header({ title, subtitle }) {
  return (
    <header className={styles.header}>
      <h1 className={styles['header-title']}>{title}</h1>
      {subtitle && <p className={styles['header-subtitle']}>{subtitle}</p>}
    </header>
  );
}
