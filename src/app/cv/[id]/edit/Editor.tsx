import React, { useState, ReactNode } from 'react';
import { EditorHeader } from './EditorHeader';
import DefaultEditorSidebar, { EditorSidebar } from './EditorSidebar';
import { DefaultEditorContent, EditorContent } from './EditorContent';
import styles from './editPage.module.css';

export interface EditorProps {
  title: string;
  isSaving: boolean;
  lastSaved: Date | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSave: () => void;
  onExport: () => void;
  children: ReactNode | ((tab: string) => ReactNode);
  sidebarSections?: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
  }>;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  sidebarClassName?: string;
}

export const Editor: React.FC<EditorProps> = ({
  title,
  isSaving,
  lastSaved,
  activeTab,
  onTabChange,
  onSave,
  onExport,
  children,
  sidebarSections,
  className = '',
  contentClassName = '',
  headerClassName = '',
  sidebarClassName = '',
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.editorContainer}>
        <div className={styles.editorContent}>
          <EditorHeader
            title={title}
            isSaving={isSaving}
            lastSaved={lastSaved}
            onSave={onSave}
            onExport={onExport}
            className={headerClassName}
          />
          
          <div className={styles.mainContent}>
            {sidebarSections ? (
              <EditorSidebar
                activeTab={activeTab}
                onTabChange={onTabChange}
                sections={sidebarSections}
                className={sidebarClassName}
              />
            ) : (
              <DefaultEditorSidebar
                activeTab={activeTab}
                onTabChange={onTabChange}
                className={sidebarClassName}
              />
            )}
            
            <EditorContent 
              activeTab={activeTab} 
              className={contentClassName}
            >
              {children}
            </EditorContent>
          </div>
        </div>
      </div>
    </div>
  );
};

// Default implementation with tab panels
export function DefaultEditor({
  title,
  isSaving,
  lastSaved,
  activeTab,
  onTabChange,
  onSave,
  onExport,
  sections,
  sidebarSections,
  className = '',
  contentClassName = '',
  headerClassName = '',
  sidebarClassName = '',
}: {
  title: string;
  isSaving: boolean;
  lastSaved: Date | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSave: () => void;
  onExport: () => void;
  sections: Array<{
    id: string;
    content: ReactNode;
  }>;
  sidebarSections?: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
  }>;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  sidebarClassName?: string;
}) {
  return (
    <Editor
      title={title}
      isSaving={isSaving}
      lastSaved={lastSaved}
      activeTab={activeTab}
      onTabChange={onTabChange}
      onSave={onSave}
      onExport={onExport}
      sidebarSections={sidebarSections}
      className={className}
      contentClassName={contentClassName}
      headerClassName={headerClassName}
      sidebarClassName={sidebarClassName}
    >
      <DefaultEditorContent 
        activeTab={activeTab}
        sections={sections}
      />
    </Editor>
  );
}
