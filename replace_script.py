import os

folders = [
    'src/app/teacher/internships/[id]/assignments',
    'src/app/teacher/internships/[id]/quizzes',
    'src/app/api/teacher/internships/[id]/assignments',
    'src/app/api/teacher/internships/[id]/quizzes'
]

for folder in folders:
    for root, dirs, files in os.walk(folder):
        for file in files:
            if file.endswith('.ts') or file.endswith('.tsx'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                content = content.replace('Course', 'Internship')
                content = content.replace('course', 'internship')
                content = content.replace('CourseId', 'InternshipId')
                content = content.replace('courseId', 'internshipId')
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {filepath}")
