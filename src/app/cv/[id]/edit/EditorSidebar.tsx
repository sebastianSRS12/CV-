import React from 'react';
import { User, Briefcase, GraduationCap, Code, BarChart3 } from 'lucide-react';
import styles from './editPage.module.css';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, onClick }) => (
  <button
    className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
    onClick={onClick}
    aria-current={isActive ? 'page' : undefined}
  >
    <span className={styles.tabIcon}>
      {icon}
    </span>
    {label}
  </button>
);

interface EditorSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  sections: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
  }>;
  className?: string;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  activeTab,
  onTabChange,
  sections,
  className = ''
}) => {
  return (
    <aside className={`${styles.sidebar} ${className}`.trim()}>
      <nav>
        <ul>
          {sections.map((section) => (
            <li key={section.id}>
              <SidebarItem
                icon={section.icon}
                label={section.label}
                isActive={activeTab === section.id}
                onClick={() => onTabChange(section.id)}
              />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

// Default export with default sections for convenience
export default function DefaultEditorSidebar(props: Omit<EditorSidebarProps, 'sections'>) {
  const defaultSections = [
    {
      id: 'personal',
      label: 'Personal Info',
      icon: <User size={16} />,
    },
    {
      id: 'experience',
      label: 'Experience',
      icon: <Briefcase size={16} />,
    },
    {
      id: 'education',
      label: 'Education',
      icon: <GraduationCap size={16} />,
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: <Code size={16} />,
    },
    {
      id: 'analysis',
      label: 'AI Analysis',
      icon: <BarChart3 size={16} />,
    },
  ];

  return <EditorSidebar {...props} sections={defaultSections} />;
}
