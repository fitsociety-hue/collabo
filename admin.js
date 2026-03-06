// admin.js - Handles logic for aggregating and analyzing all employees' data

document.addEventListener('DOMContentLoaded', () => {
    // Views
    const views = {
        input: document.getElementById('view-admin-input'),
        report: document.getElementById('view-admin-report')
    };

    const showView = (viewName) => {
        Object.values(views).forEach(v => {
            v.classList.remove('active-view');
            setTimeout(() => v.classList.add('hidden'), 200);
        });
        setTimeout(() => {
            views[viewName].classList.remove('hidden');
            void views[viewName].offsetWidth;
            views[viewName].classList.add('active-view');
        }, 200);
        window.scrollTo(0, 0);
    };

    // Dictionary of all words for quick lookup by name
    const allWords = {};
    data.part1.forEach(w => allWords[w.word.trim()] = { ...w, part: 1 });
    data.part2.forEach(w => allWords[w.word.trim()] = { ...w, part: 2 });

    document.getElementById('btn-analyze-all').addEventListener('click', () => {
        const text = document.getElementById('data-input').value;
        if (!text.trim()) {
            alert("분석할 데이터를 입력해주세요.");
            return;
        }

        // Parse pasted text and extract word counts
        // Clean up text and split into non-empty lines to estimate participants
        const lines = text.trim().split('\n').filter(line => line.trim().length > 0);

        let totalParticipants = lines.length;
        // Adjust for common header names in spreadsheet
        if (lines[0].includes('name') || lines[0].includes('가명') || lines[0].includes('timestamp')) {
            totalParticipants = Math.max(0, totalParticipants - 1);
        }

        const countsPart1 = {};
        const countsPart2 = {};
        const categoryCounts = {
            communication: 0,
            culture: 0,
            attitude: 0,
            system: 0
        };

        // Scan text for occurrences of our specific words
        // We use a simple global scan which is highly robust against formatting issues
        Object.keys(allWords).forEach(wordName => {
            // Escape possible special characters in wordName although our words don't have them
            const sanitizedWord = wordName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(sanitizedWord, 'g');
            const matches = text.match(regex);
            const count = matches ? matches.length : 0;

            if (count > 0) {
                const info = allWords[wordName];
                if (info.part === 1) countsPart1[wordName] = count;
                else countsPart2[wordName] = count;

                categoryCounts[info.category] += count;
            }
        });

        // Sort to get Top 5
        const topPart1 = Object.entries(countsPart1).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const topPart2 = Object.entries(countsPart2).sort((a, b) => b[1] - a[1]).slice(0, 5);

        // Render UI
        document.getElementById('total-participants').innerText = totalParticipants;

        const renderTags = (items, elementId) => {
            const el = document.getElementById(elementId);
            if (items.length === 0) {
                el.innerHTML = '<span style="opacity:0.6;">추출된 키워드가 없습니다.</span>';
                return;
            }
            // Use different saturation based on rank
            el.innerHTML = items.map((i, idx) => {
                const isTop = idx === 0;
                const highlightCss = isTop ? 'background: rgba(99, 102, 241, 0.5); border: 2px solid var(--accent);' : '';
                return `<span class="tag" style="${highlightCss}">${i[0]} <span style="opacity:0.8;font-size:0.85em">(${i[1]}건)</span></span>`;
            }).join('');
        };

        renderTags(topPart1, 'tags-top-part1');
        renderTags(topPart2, 'tags-top-part2');

        // Dominant overall category
        let dominantCategory = Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b);

        // Fallback if no category was parsed
        if (categoryCounts[dominantCategory] === 0) {
            dominantCategory = 'communication';
        }

        // Render integrated analysis (reusing the template)
        document.getElementById('analysis-integrated-all').innerHTML = data.analysis.integratedTpl(data.analysis.categories[dominantCategory]);

        // Suggestions - show all, prioritized by category counts
        const sortedCategories = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a]);

        let sugHTML = '';
        sortedCategories.forEach((cat, index) => {
            if (categoryCounts[cat] === 0 && totalParticipants > 0) return; // Skip if 0 mentions, unless empty data

            const catDisplay = cat === 'communication' ? '소통(Communication)' :
                cat === 'culture' ? '조직문화(Culture)' :
                    cat === 'attitude' ? '태도(Attitude)' : '시스템(System)';

            const isPrimary = index === 0;
            const rankStyle = isPrimary ? 'color: var(--accent-light); font-size: 1.2rem; margin-top: 1rem;' : 'color: rgba(255,255,255,0.8); margin-top: 2rem;';
            const badge = isPrimary ? '<span style="background: var(--accent); color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; margin-left: 10px; vertical-align: middle;">최우선 과제</span>' : '';

            sugHTML += `<h4 style="${rankStyle} border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 0.5rem;">[${catDisplay}] 카테고리 ${badge}</h4>`;

            data.analysis.suggestions[cat].forEach(s => {
                sugHTML += `
                <div class="suggestion-card" style="${isPrimary ? 'border-left: 4px solid var(--accent)' : ''}">
                    <h4>${s.title}</h4>
                    <p><strong>필요성:</strong> ${s.reason}</p>
                    <h5 style="margin-top: 10px; opacity: 0.9;">세부 실행 계획:</h5>
                    <ul class="action-items" style="margin-top: 5px;">
                        ${s.actionInfo.map(act => `<li>${act}</li>`).join('')}
                    </ul>
                </div>
                `;
            });
        });

        document.getElementById('admin-suggestions-container').innerHTML = sugHTML;

        showView('report');
    });

    document.getElementById('btn-restart-admin').addEventListener('click', () => {
        document.getElementById('data-input').value = '';
        showView('input');
    });

    // PDF Download
    document.getElementById('btn-download-pdf').addEventListener('click', () => {
        const element = document.getElementById('report-content');
        const opt = {
            margin: 10,
            filename: `협업브릿지_전체통합분석.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        element.classList.add('pdf-exporting');
        html2pdf().set(opt).from(element).save().then(() => {
            element.classList.remove('pdf-exporting');
        });
    });
});
