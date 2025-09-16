'use client'

import { CVData } from '@/lib/pdf/pdf-generator'

interface MinimalTemplateProps {
  data: CVData
  className?: string
}

export function MinimalTemplate({ data, className = '' }: MinimalTemplateProps) {
  return (
    <div className={`bg-white dark:bg-gray-900 min-h-screen transition-colors ${className}`} id="cv-preview">
      <div className="max-w-3xl mx-auto p-8 space-y-8">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h1 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-2">{data.personalInfo.name}</h1>
          <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
            <span>{data.personalInfo.email}</span>
            {data.personalInfo.phone && <span>•</span>}
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
            {data.personalInfo.location && <span>•</span>}
            {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
            {data.personalInfo.website && <span>•</span>}
            {data.personalInfo.website && (
              <a href={data.personalInfo.website} className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                {data.personalInfo.website}
              </a>
            )}
          </div>
        </header>

        {/* Summary */}
        {data.summary && (
          <section>
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">About</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{data.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section>
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Experience</h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{exp.title}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {exp.startDate} — {exp.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{exp.company}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{exp.description}</p>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2">—</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section>
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Education</h2>
            <div className="space-y-3">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{edu.degree}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{edu.graduationDate}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{edu.institution}</p>
                  {edu.gpa && <p className="text-sm text-gray-600 dark:text-gray-400">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Skills</h2>
            <div className="space-y-2">
              {data.skills.map((skillGroup, index) => (
                <div key={index} className="flex flex-col sm:flex-row">
                  <span className="font-medium text-gray-900 dark:text-gray-100 sm:w-32 sm:flex-shrink-0">
                    {skillGroup.category}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{skillGroup.items.join(', ')}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section>
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Projects</h2>
            <div className="space-y-4">
              {data.projects.map((project, index) => (
                <div key={index}>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{project.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{project.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {project.technologies.join(' • ')}
                  </p>
                  {(project.url || project.github) && (
                    <div className="flex gap-3 mt-1">
                      {project.url && (
                        <a
                          href={project.url}
                          className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Demo
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Code
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
