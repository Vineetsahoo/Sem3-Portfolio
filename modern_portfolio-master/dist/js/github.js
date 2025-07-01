document.addEventListener('DOMContentLoaded', () => {
  const username = 'Vineetsahoo'; // Your GitHub username
  
  // Fetch GitHub profile and repo stats
  const fetchWithTimeout = (url, options = {}, timeout = 5000) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out')), timeout)
      )
    ]);
  };

  // Safely get element with fallback
  const getElement = (id) => {
    const element = document.getElementById(id);
    if (!element) {
      console.error(`Element with ID '${id}' not found`);
      return null;
    }
    return element;
  };

  // Animate number counting
  const animateCounter = (element, targetValue) => {
    const duration = 2000;
    const frameRate = 30;
    const totalFrames = duration / (1000 / frameRate);
    let currentFrame = 0;
    const initialValue = 0;
    const increment = targetValue / totalFrames;
    
    const counter = setInterval(() => {
      currentFrame++;
      const value = Math.floor(initialValue + (increment * currentFrame));
      element.textContent = value;
      
      if (currentFrame === totalFrames) {
        clearInterval(counter);
        element.textContent = targetValue;
      }
    }, 1000 / frameRate);
  };

  // Fetch GitHub profile with better error handling
  fetchWithTimeout(`https://api.github.com/users/${username}`)
    .then(response => {
      if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
      return response.json();
    })
    .then(data => {
      const reposDiv = getElement('github-repos');
      if (!reposDiv) return;
      
      // Remove loading indicator
      const loadingIndicator = reposDiv.querySelector('.loading-indicator');
      if (loadingIndicator) {
        loadingIndicator.remove();
      }
      
      // Create counter element
      const countSpan = document.createElement('span');
      countSpan.className = 'count';
      countSpan.textContent = '0';
      
      reposDiv.querySelector('p').remove(); // Remove loading text
      
      // Add counter and follower info
      reposDiv.appendChild(countSpan);
      
      const followerInfo = document.createElement('p');
      followerInfo.innerHTML = `Followers: <span class="follower-count">0</span>`;
      reposDiv.appendChild(followerInfo);
      
      // Animate the counters
      setTimeout(() => {
        animateCounter(countSpan, data.public_repos);
        animateCounter(followerInfo.querySelector('.follower-count'), data.followers);
      }, 500);
      
      // Add profile link button
      const profileLink = document.createElement('a');
      profileLink.href = data.html_url;
      profileLink.className = 'btn-light';
      profileLink.innerHTML = '<i class="fab fa-github"></i> View Profile';
      profileLink.target = '_blank';
      profileLink.rel = 'noopener noreferrer'; // Security best practice
      reposDiv.appendChild(profileLink);
    })
    .catch(error => {
      console.error("Error fetching GitHub profile:", error);
      const reposDiv = getElement('github-repos');
      if (reposDiv) {
        reposDiv.innerHTML = `
          <div class="stat-icon"><i class="fas fa-exclamation-circle"></i></div>
          <h3>GitHub Stats</h3>
          <p>Could not load GitHub stats. ${error.message}</p>
        `;
      }
    });
  
  // Fetch GitHub streak stats with enhanced visualization
  const streakDiv = getElement('github-streak');
  if (streakDiv) {
    // Remove loading indicator when image loads
    const loadingIndicator = streakDiv.querySelector('.loading-indicator');
    const loadingText = streakDiv.querySelector('p');
    
    const img = document.createElement('img');
    img.src = `https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=dark&hide_border=true&background=1a1a2e&ring=ee761a&fire=ee761a&currStreakLabel=ee761a`;
    img.alt = "GitHub streak stats";
    img.style.maxWidth = "100%";
    img.style.borderRadius = "var(--border-radius)";
    img.style.opacity = "0";
    img.style.transition = "opacity 0.5s ease";
    
    img.onload = () => {
      if (loadingIndicator) loadingIndicator.remove();
      if (loadingText) loadingText.remove();
      img.style.opacity = "1";
    };
    
    img.onerror = () => {
      if (loadingIndicator) loadingIndicator.remove();
      if (loadingText) {
        loadingText.innerHTML = "Could not load streak stats.";
      }
    };
    
    streakDiv.appendChild(img);
  }
  
  // Fetch repositories for language stats with enhanced visualization
  fetchWithTimeout(`https://api.github.com/users/${username}/repos?per_page=100`)
    .then(response => {
      if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
      return response.json();
    })
    .then(repos => {
      const languagesDiv = getElement('github-languages');
      if (!languagesDiv) return;
      
      // Remove loading elements
      const loadingIndicator = languagesDiv.querySelector('.loading-indicator');
      if (loadingIndicator) loadingIndicator.remove();
      
      const loadingText = languagesDiv.querySelector('p');
      if (loadingText) loadingText.remove();
      
      // Calculate language distribution
      const languages = {};
      
      repos.forEach(repo => {
        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
      });
      
      // Convert to percentage
      const languageArray = Object.entries(languages).map(([name, count]) => ({
        name,
        percentage: Math.round((count / repos.length) * 100)
      }));
      
      // Sort by percentage (descending)
      languageArray.sort((a, b) => b.percentage - a.percentage);
      
      // Take top 5 languages
      const topLanguages = languageArray.slice(0, 5);
      
      // Display languages with enhanced visualization
      const langDiv = document.createElement('div');
      langDiv.className = 'language-bars';
      
      if (topLanguages.length === 0) {
        langDiv.innerHTML = '<p>No language data available</p>';
      } else {
        topLanguages.forEach((lang, index) => {
          const delay = index * 0.1;
          
          langDiv.innerHTML += `
            <div class="language-bar" style="animation-delay: ${delay}s">
              <div class="language-name">
                <span>${lang.name}</span>
                <span>${lang.percentage}%</span>
              </div>
              <div class="bar">
                <div class="fill" style="--width-percent: ${lang.percentage}%"></div>
              </div>
            </div>
          `;
        });
      }
      
      languagesDiv.appendChild(langDiv);
      
      // Add repo count as a summary
      const repoSummary = document.createElement('p');
      repoSummary.innerHTML = `Based on ${repos.length} repositories`;
      repoSummary.style.marginTop = "1.5rem";
      repoSummary.style.fontSize = "0.9rem";
      repoSummary.style.opacity = "0.7";
      languagesDiv.appendChild(repoSummary);
    })
    .catch(error => {
      console.error("Error fetching GitHub repos:", error);
      const languagesDiv = getElement('github-languages');
      if (languagesDiv) {
        languagesDiv.innerHTML = `
          <div class="stat-icon"><i class="fas fa-exclamation-circle"></i></div>
          <h3>Languages</h3>
          <p>Could not load language stats. ${error.message}</p>
        `;
      }
    });
});