import re

def analyze_cv_text(text):
    """
    A simple ATS CV analyzer.
    """
    text = text.lower()
    score = 100
    recommendations = []
    
    # 1. Check length
    word_count = len(text.split())
    if word_count < 150:
        score -= 20
        recommendations.append("Your CV is very short. Try adding more details about your experience and projects.")
    elif word_count > 1000:
        score -= 10
        recommendations.append("Your CV is quite long. Consider condensing it to the most relevant information.")
        
    # 2. Check for standard sections
    sections = ['experience', 'education', 'skills', 'projects']
    for section in sections:
        if section not in text:
            score -= 10
            recommendations.append(f"Missing '{section.capitalize()}' section. ATS systems often look for standard headings.")
            
    # 3. Check for action verbs
    action_verbs = ['developed', 'managed', 'created', 'led', 'designed', 'implemented', 'improved', 'analyzed', 'built']
    verbs_found = [v for v in action_verbs if v in text]
    if len(verbs_found) < 3:
        score -= 15
        recommendations.append("Try starting bullet points with strong action verbs (e.g., developed, managed, led).")
        
    # 4. Check for quantifiable results
    if not re.search(r'\d+%|\d+ percent|\$\d+', text):
        score -= 10
        recommendations.append("Include quantifiable results (e.g., 'improved performance by 20%') to highlight your impact.")

    # 5. Check for common tech keywords if it's a tech CV (basic check)
    tech_keywords = ['python', 'java', 'javascript', 'react', 'django', 'sql', 'html', 'css', 'git']
    tech_found = [k for k in tech_keywords if k in text]
    if len(tech_found) == 0:
        recommendations.append("Consider adding more specific technical skills keywords if you are applying for tech roles.")
        
    score = max(0, score)
    return {
        'score': score,
        'recommendations': recommendations,
        'parsed_words': word_count
    }
