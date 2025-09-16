'use client'

import { CVData } from '@/lib/pdf/pdf-generator'

interface ModernTemplateProps {
  data: CVData
  className?: string
}

export function ModernTemplate({ data, className = '' }: ModernTemplateProps) {
  return (
    <div className={`bg-white dark:bg-gray-900 min-h-screen transition-colors ${className}`} id="cv-preview">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{data.personalInfo.name}</h1>
          <div className="flex flex-wrap gap-4 text-blue-100">
            <span>{data.personalInfo.email}</span>
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
            {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
            {data.personalInfo.website && (
              <a href={data.personalInfo.website} className="hover:text-white transition-colors">
                {data.personalInfo.website}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Summary */}
        {data.summary && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 border-b-2 border-blue-600 pb-2">
              Professional Summary
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{data.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 border-b-2 border-blue-600 pb-2">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-600 pl-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{exp.title}</h3>
                      <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">{exp.company}</p>
                      {exp.location && <p className="text-gray-600 dark:text-gray-400">{exp.location}</p>}
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{exp.description}</p>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
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
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 border-b-2 border-blue-600 pb-2">
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="flex flex-col md:flex-row md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{edu.degree}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">{edu.institution}</p>
                    {edu.location && <p className="text-gray-600 dark:text-gray-400">{edu.location}</p>}
                    {edu.gpa && <p className="text-gray-600 dark:text-gray-400">GPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 font-medium">{edu.graduationDate}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 border-b-2 border-blue-600 pb-2">
              Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.skills.map((skillGroup, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {skillGroup.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 border-b-2 border-blue-600 pb-2">
              Projects
            </h2>
            <div className="space-y-6">
              {data.projects.map((project, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{project.name}</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {(project.url || project.github) && (
                    <div className="flex gap-4">
                      {project.url && (
                        <a
                          href={project.url}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Live Demo
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          GitHub
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
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 border-b-2 border-blue-600 pb-2">
              Certifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.certifications.map((cert, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{cert.name}</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">{cert.issuer}</p>
                  <p className="text-gray-600 dark:text-gray-400">{cert.date}</p>
                  {cert.url && (
                    <a
                      href={cert.url}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Certificate
                    </a>
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
