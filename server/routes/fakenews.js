const express = require('express');
const router = express.Router();

const trustedSources = ['bbc', 'reuters', 'ap', 'bloomberg', 'guardian', 'nytimes', 'washingtonpost', 'npr', 'associated press', 'the hindu', 'ndtv', 'times of india'];
const sensationalWords = ['shocking', 'unbelievable', 'you won\'t believe', 'miracle', 'secret', 'they don\'t want you to know', 'explosive', 'bombshell', 'hoax', 'fake', 'exposed', 'conspiracy'];

router.post('/analyze', (req, res) => {
  try {
    const { title = '', content = '', source = '' } = req.body;
    let score = 100;
    let reasons = [];

    const fullText = `${title} ${content}`.toLowerCase();
    const lcSource = source.toLowerCase().trim();

    // 1. Check Source Credibility
    if (!lcSource) {
      score -= 20;
      reasons.push('No source provided (decreased factor).');
    } else {
      const isTrusted = trustedSources.some(ts => lcSource.includes(ts));
      if (isTrusted) {
        reasons.push('Source matches known trusted outlets (+Credibility).');
      } else {
        score -= 15;
        reasons.push(`Source '${source}' is not in our known list of highly credible outlets.`);
      }
    }

    // 2. Sensational Language Detection
    let sensationalCount = 0;
    sensationalWords.forEach(word => {
      if (fullText.includes(word)) {
        sensationalCount++;
      }
    });

    if (sensationalCount > 0) {
      score -= (sensationalCount * 10);
      reasons.push(`Detected ${sensationalCount} sensational or clickbait-like terms.`);
    }

    // 3. Punctuation Abuse
    const exclamationMatches = fullText.match(/!{2,}/g);
    const questionMatches = fullText.match(/\?{2,}/g);
    
    if (exclamationMatches) {
      score -= 15;
      reasons.push('Excessive exclamation marks detected, often used to artificially heighten emotion.');
    }
    
    if (questionMatches) {
      score -= 10;
      reasons.push('Excessive question marks detected, a common tactic for unverified claims.');
    }

    // 4. Content Length
    if (content && content.length < 50) {
      score -= 20;
      reasons.push('Content is exceptionally short and may lack sufficient context or detail.');
    } else if (!content && title.length < 20) {
      score -= 10;
      reasons.push('Very short title with no content provided.');
    }

    // Clamp score
    score = Math.max(0, Math.min(100, score));

    // Determine Verdict
    let verdict = 'Credible';
    let color = 'green';
    
    if (score < 40) {
      verdict = 'Likely Fake';
      color = 'red';
    } else if (score < 75) {
      verdict = 'Questionable';
      color = 'yellow';
    }

    if (score >= 75 && reasons.length === 0) {
      reasons.push('No red flags detected. Language and sourcing appear standard.');
    }

    res.json({
      score,
      verdict,
      reasons,
      color
    });

  } catch (error) {
    console.error('FakeNews analysis error', error);
    res.status(500).json({ message: 'Server error during analysis' });
  }
});

module.exports = router;
