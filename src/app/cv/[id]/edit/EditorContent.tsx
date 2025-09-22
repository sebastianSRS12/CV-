import React, { ReactNode } from 'react';
import styles from './editPage.module.css';

interface EditorContentProps {
  activeTab: string;
  children: ReactNode | ((tab: string) => ReactNode);
  className?: string;
}

export const EditorContent: React.FC<EditorContentProps> = ({
  activeTab,
  children,
  className = '',
}) => {
  const content = typeof children === 'function' 
    ? children(activeTab) 
    : children;

  return (
    <main className={`${styles.content} ${className}`}>
      {content}
    </main>
  );
};

// Default implementation with tab panels
export function DefaultEditorContent({
  activeTab,
  sections,
  children,
}: {
  activeTab: string;
  sections: Array<{
    id: string;
    content: ReactNode;
  }>;
  children?: (tab: string) => ReactNode;
}) {
  return (
    <EditorContent activeTab={activeTab}>
      {children ? (
        children(activeTab)
      ) : (
        sections.map((section) => (
          <div 
            key={section.id}
            style={{ 
              display: activeTab === section.id ? 'block' : 'none' 
            }}
          >
            {section.content}
          </div>
        ))
      )}
    </EditorContent>
  );
}
