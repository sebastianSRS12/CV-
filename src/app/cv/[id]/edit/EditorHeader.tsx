import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Save, Check, Loader2 } from 'lucide-react';
import styles from './editPage.module.css';

interface EditorHeaderProps {
  title: string;
  isSaving: boolean;
  lastSaved: Date | null;
  onSave: () => void;
  onExport: () => void;
  className?: string;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  title,
  isSaving,
  lastSaved,
  onSave,
  onExport,
  className = ''
}) => {
  const router = useRouter();
  
  return (
    <header className={`${styles.header} ${className || ''}`}>
      <button 
        onClick={() => router.back()}
        className={`${styles.button} ${styles.buttonSecondary}`}
        aria-label="Go back"
      >
        <ArrowLeft className={styles.buttonIcon} />
        Back
      </button>
      
      <h1 className={styles.title}>{title}</h1>
      
      <div className={styles.actions}>
        <div className={styles.saveStatus}>
          {isSaving ? (
            <>
              <Loader2 className={`${styles.saveIcon} ${styles.saving}`} />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className={styles.saveIcon} />
              <span>
                {lastSaved 
                  ? `Saved at ${lastSaved.toLocaleTimeString()}`
                  : 'All changes saved'}
              </span>
            </>
          )}
        </div>
        
        <button
          onClick={onExport}
          className={`${styles.button} ${styles.buttonSecondary}`}
          disabled={isSaving}
        >
          <Download className={styles.buttonIcon} />
          Export
        </button>
        
        <button
          onClick={onSave}
          className={`${styles.button} ${styles.buttonPrimary}`}
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className={`${styles.buttonIcon} ${styles.saving}`} />
          ) : (
            <Save className={styles.buttonIcon} />
          )}
          Save
        </button>
      </div>
    </header>
  );
};
