'use client'

import { CVData } from '@/lib/pdf/pdf-generator'

interface ClassicTemplateProps {
  data: CVData
  className?: string
}

export function ClassicTemplate({ data, className = '' }: ClassicTemplateProps) {
  return (
    <div className={`bg-white dark:bg-gray-900 min-h-screen transition-colors ${className}`} id="cv-preview">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <header className="text-center border-b-2 border-gray-800 dark:border-gray-200 pb-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">{data.personalInfo.name}</h1>
          <div className="text-gray-700 dark:text-gray-300">
            {[
              data.personalInfo.email,
              data.personalInfo.phone,
              data.personalInfo.location,
              data.personalInfo.website
            ].filter(Boolean).join(' | ')}
          </div>
        </header>

        <div className="space-y-8">
          {/* Objective/Summary */}
          {data.summary && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">
                Objective
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">{data.summary}</p>
            </section>
          )}

          {/* Professional Experience */}
          {data.experience.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wide">
                Professional Experience
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{exp.title}</h3>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">{exp.company}</p>
                        {exp.location && <p className="text-gray-600 dark:text-gray-400 italic">{exp.location}</p>}
                      </div>
                      <span className="text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap ml-4">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3 text-justify">{exp.description}</p>
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wide">
                Education
              </h2>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{edu.degree}</h3>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">{edu.institution}</p>
                      {edu.location && <p className="text-gray-600 dark:text-gray-400 italic">{edu.location}</p>}
                      {edu.gpa && <p className="text-gray-600 dark:text-gray-400">GPA: {edu.gpa}</p>}
                      {edu.honors && edu.honors.length > 0 && (
                        <p className="text-gray-600 dark:text-gray-400 italic">{edu.honors.join(', ')}</p>
                      )}
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap ml-4">
                      {edu.graduationDate}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wide">
                Technical Skills
              </h2>
              <div className="space-y-3">
                {data.skills.map((skillGroup, index) => (
                  <div key={index} className="flex">
                    <span className="font-bold text-gray-900 dark:text-gray-100 w-32 flex-shrink-0">
                      {skillGroup.category}:
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wide">
                Notable Projects
              </h2>
              <div className="space-y-4">
                {data.projects.map((project, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{project.name}</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-2 text-justify">{project.description}</p>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      Technologies: {project.technologies.join(', ')}
                    </p>
                    {(project.url || project.github) && (
                      <div className="flex gap-4 mt-1">
                        {project.url && (
                          <a
                            href={project.url}
                            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Live Demo
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Source Code
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wide">
                Certifications
              </h2>
              <div className="space-y-3">
                {data.certifications.map((cert, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">{cert.name}</h3>
                      <p className="text-gray-700 dark:text-gray-300">{cert.issuer}</p>
                      {cert.url && (
                        <a
                          href={cert.url}
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 underline text-sm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Certificate
                        </a>
                      )}
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap ml-4">
                      {cert.date}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
